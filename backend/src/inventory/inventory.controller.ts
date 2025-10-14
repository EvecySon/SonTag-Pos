import { Body, Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InventoryService } from './inventory.service';

class AdjustStockDto { delta!: number; }

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get()
  async list(@Query('branchId') branchId: string) {
    return this.inventory.listByBranch(branchId);
  }

  @Put(':productId/adjust')
  async adjust(@Param('productId') productId: string, @Query('branchId') branchId: string, @Body() dto: AdjustStockDto, @Req() req: any) {
    return this.inventory.adjust(productId, branchId, dto, req.user?.role);
  }
}
