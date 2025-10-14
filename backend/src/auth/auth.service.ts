import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  branchName: string;
  branchLocation: string;
}

interface LoginInput {
  username: string; // or email
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(input: RegisterInput) {
    const { username, email, password, branchName, branchLocation } = input;

    const existing = await this.prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existing) throw new ConflictException('User already exists');

    const branch = await this.prisma.branch.create({
      data: { name: branchName, location: branchLocation },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'ADMIN',
        branchId: branch.id,
      },
      select: { id: true, username: true, email: true, role: true, branchId: true },
    });

    const payload = { sub: user.id, role: user.role, branchId: user.branchId };
    const token = await this.jwt.signAsync(payload);

    return { token, user };
  }

  async login(input: LoginInput) {
    const { username, password } = input;

    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role, branchId: user.branchId };
    const token = await this.jwt.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
      },
    };
  }
}
