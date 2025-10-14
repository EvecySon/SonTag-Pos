import { PrismaService } from '../prisma/prisma.service';
interface CreatePriceListDto {
    name: string;
    branchId: string;
    sectionId?: string;
    active?: boolean;
}
interface UpsertPriceEntryDto {
    priceListId: string;
    productId: string;
    price: string;
}
export declare class PricingService {
    private prisma;
    constructor(prisma: PrismaService);
    getEffectivePrices(branchId: string, sectionId?: string): Promise<Record<string, number>>;
    createPriceList(dto: CreatePriceListDto): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        sectionId: string | null;
    }>;
    upsertPriceEntry(dto: UpsertPriceEntryDto): Promise<{
        id: string;
        createdAt: Date;
        priceListId: string;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
}
export {};
