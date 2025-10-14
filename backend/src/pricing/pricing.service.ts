import { Injectable, NotFoundException } from '@nestjs/common';
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
  price: string; // decimal string
}

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async getEffectivePrices(branchId: string, sectionId?: string) {
    // Try section-scoped active list first, then branch-level active list
    const priceList = await this.prisma.priceList.findFirst({
      where: {
        branchId,
        active: true,
        ...(sectionId ? { sectionId } : { sectionId: null }),
      },
      include: { entries: true },
      orderBy: { createdAt: 'desc' },
    }) || await this.prisma.priceList.findFirst({
      where: { branchId, active: true, sectionId: null },
      include: { entries: true },
      orderBy: { createdAt: 'desc' },
    });

    const entriesMap: Record<string, number> = {};

    if (priceList) {
      for (const e of priceList.entries) {
        entriesMap[e.productId] = parseFloat((e.price as unknown as string) || '0');
      }
    }

    // Fallback: for products missing in price list, use product.price
    const products = await this.prisma.product.findMany({ where: { branchId } });
    for (const p of products) {
      if (entriesMap[p.id] === undefined) {
        entriesMap[p.id] = parseFloat((p.price as unknown as string) || '0');
      }
    }

    return entriesMap;
  }

  async createPriceList(dto: CreatePriceListDto) {
    return this.prisma.priceList.create({
      data: {
        name: dto.name,
        branchId: dto.branchId,
        sectionId: dto.sectionId ?? null,
        active: dto.active ?? true,
      },
    });
  }

  async upsertPriceEntry(dto: UpsertPriceEntryDto) {
    // Ensure price list exists
    const pl = await this.prisma.priceList.findUnique({ where: { id: dto.priceListId } });
    if (!pl) throw new NotFoundException('Price list not found');

    const existing = await this.prisma.priceEntry.findUnique({
      where: { priceListId_productId: { priceListId: dto.priceListId, productId: dto.productId } },
    });

    if (existing) {
      return this.prisma.priceEntry.update({
        where: { id: existing.id },
        data: { price: dto.price as any },
      });
    }

    return this.prisma.priceEntry.create({
      data: {
        priceListId: dto.priceListId,
        productId: dto.productId,
        price: dto.price as any,
      },
    });
  }
}
