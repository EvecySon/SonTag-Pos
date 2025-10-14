import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateBranchDto {
  name: string;
  location: string;
}

interface UpdateBranchDto {
  name?: string;
  location?: string;
}

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.branch.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateBranchDto, role: string) {
    if (role !== 'ADMIN' && role !== 'MANAGER') throw new ForbiddenException('Insufficient role');
    return this.prisma.branch.create({ data: dto });
  }

  async update(id: string, dto: UpdateBranchDto, role: string) {
    if (role !== 'ADMIN' && role !== 'MANAGER') throw new ForbiddenException('Insufficient role');
    const existing = await this.prisma.branch.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Branch not found');
    return this.prisma.branch.update({ where: { id }, data: dto });
  }
}
