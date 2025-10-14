import { ProductsService } from './products.service';
declare class CreateProductDto {
    name: string;
    sku: string;
    category?: string;
    price: string;
    taxRate?: string;
    branchId: string;
}
declare class UpdateProductDto {
    name?: string;
    sku?: string;
    category?: string;
    price?: string;
    taxRate?: string;
}
export declare class ProductsController {
    private readonly products;
    constructor(products: ProductsService);
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
    create(dto: CreateProductDto, req: any): Promise<{
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
    update(id: string, dto: UpdateProductDto, req: any): Promise<{
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
