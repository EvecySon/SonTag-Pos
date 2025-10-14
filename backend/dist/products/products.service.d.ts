import { PrismaService } from '../prisma/prisma.service';
interface CreateProductDto {
    name: string;
    sku: string;
    category?: string;
    price: string;
    taxRate?: string;
    branchId: string;
}
interface UpdateProductDto {
    name?: string;
    sku?: string;
    category?: string;
    price?: string;
    taxRate?: string;
}
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(branchId?: string): Promise<{
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    create(dto: CreateProductDto, role: string): Promise<{
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, dto: UpdateProductDto, role: string): Promise<{
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sku: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
export {};
