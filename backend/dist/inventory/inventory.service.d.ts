import { PrismaService } from '../prisma/prisma.service';
interface AdjustStockDto {
    delta: number;
}
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    listByBranch(branchId: string): Promise<({
        product: {
            id: string;
            branchId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sku: string;
            category: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            taxRate: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qtyOnHand: number;
        minLevel: number;
    })[]>;
    adjust(productId: string, branchId: string, dto: AdjustStockDto, role: string): Promise<{
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qtyOnHand: number;
        minLevel: number;
    }>;
}
export {};
