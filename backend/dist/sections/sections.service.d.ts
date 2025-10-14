import { PrismaService } from '../prisma/prisma.service';
export declare class SectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    listByBranch(branchId: string): Promise<{
        id: string;
        name: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
