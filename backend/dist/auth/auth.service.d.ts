import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
interface RegisterInput {
    username: string;
    email: string;
    password: string;
    branchName: string;
    branchLocation: string;
}
interface LoginInput {
    username: string;
    password: string;
}
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(input: RegisterInput): Promise<{
        token: string;
        user: {
            username: string;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            branchId: string | null;
        };
    }>;
    login(input: LoginInput): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            branchId: string | null;
        };
    }>;
}
export {};
