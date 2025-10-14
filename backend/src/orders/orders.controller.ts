import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

interface CreateOrderItem { productId: string; qty: number; price: string; }
interface PaymentDto { method: string; amount: string; reference?: string }
class CreateOrderDto { branchId!: string; items!: CreateOrderItem[]; payment?: PaymentDto }

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  async list(@Query('branchId') branchId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.orders.list(branchId, from, to);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user?.userId as string | undefined;
    return this.orders.create(dto, userId);
  }
}
