import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        username: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
    }>;
}
