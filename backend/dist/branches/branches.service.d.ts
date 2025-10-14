import { PrismaService } from '../prisma/prisma.service';
interface CreateBranchDto {
    name: string;
    location: string;
}
interface UpdateBranchDto {
    name?: string;
    location?: string;
}
export declare class BranchesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
    }[]>;
    create(dto: CreateBranchDto, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
    }>;
    update(id: string, dto: UpdateBranchDto, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        location: string;
    }>;
}
export {};
