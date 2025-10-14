import { PricingService } from './pricing.service';
declare class CreatePriceListDto {
    name: string;
    branchId: string;
    sectionId?: string;
    active?: boolean;
}
declare class UpsertPriceEntryDto {
    priceListId: string;
    productId: string;
    price: string;
}
export declare class PricingController {
    private readonly pricing;
    constructor(pricing: PricingService);
    effective(branchId: string, sectionId?: string): Promise<Record<string, number>>;
}
export declare class PriceListsController {
    private readonly pricing;
    constructor(pricing: PricingService);
    create(dto: CreatePriceListDto): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        sectionId: string | null;
    }>;
    upsertEntry(dto: UpsertPriceEntryDto): Promise<{
        id: string;
        createdAt: Date;
        priceListId: string;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
}
export {};
