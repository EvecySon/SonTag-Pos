import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

class CreateProductDto {
  name!: string;
  sku!: string;
  category?: string;
  price!: string; // decimal string
  taxRate?: string; // decimal string
  branchId!: string;
}

class UpdateProductDto {
  name?: string;
  sku?: string;
  category?: string;
  price?: string;
  taxRate?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  async list(@Query('branchId') branchId?: string) {
    return this.products.list(branchId);
  }

  @Post()
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.products.create(dto, req.user?.role);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req: any) {
    return this.products.update(id, dto, req.user?.role);
  }
}
