import { InventoryService } from './inventory.service';
declare class AdjustStockDto {
    delta: number;
}
export declare class InventoryController {
    private readonly inventory;
    constructor(inventory: InventoryService);
    list(branchId: string): Promise<({
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
    adjust(productId: string, branchId: string, dto: AdjustStockDto, req: any): Promise<{
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
