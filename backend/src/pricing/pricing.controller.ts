import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PricingService } from './pricing.service';

class CreatePriceListDto {
  name!: string;
  branchId!: string;
  sectionId?: string;
  active?: boolean;
}

class UpsertPriceEntryDto {
  priceListId!: string;
  productId!: string;
  price!: string; // decimal string
}

@UseGuards(JwtAuthGuard)
@Controller('prices')
export class PricingController {
  constructor(private readonly pricing: PricingService) {}

  @Get()
  async effective(@Query('branchId') branchId: string, @Query('sectionId') sectionId?: string) {
    return this.pricing.getEffectivePrices(branchId, sectionId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('price-lists')
export class PriceListsController {
  constructor(private readonly pricing: PricingService) {}

  @Post()
  async create(@Body() dto: CreatePriceListDto) {
    return this.pricing.createPriceList(dto);
  }

  @Post('entries')
  async upsertEntry(@Body() dto: UpsertPriceEntryDto) {
    return this.pricing.upsertPriceEntry(dto);
  }
}
