import { PrismaService } from '../prisma/prisma.service';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    listBySection(sectionId: string): Promise<{
        id: string;
        name: string;
        status: string;
        sectionId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    lock(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        sectionId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    unlock(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        sectionId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
