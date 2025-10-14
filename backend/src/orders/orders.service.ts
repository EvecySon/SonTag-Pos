import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateOrderItem { productId: string; qty: number; price: string; }
interface PaymentDto { method: string; amount: string; reference?: string }
interface CreateOrderDto { branchId: string; items: CreateOrderItem[]; payment?: PaymentDto }

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async list(branchId?: string, from?: string, to?: string) {
    return this.prisma.order.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
        ...(from || to
          ? { createdAt: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateOrderDto, userId?: string) {
    if (!dto.items?.length) throw new BadRequestException('No items');

    return this.prisma.$transaction(async (tx) => {
      // create order
      const order = await tx.order.create({
        data: {
          branchId: dto.branchId,
          userId: userId || null,
          status: 'PAID',
          total: '0' as any,
        },
      });

      let total = 0;

      for (const it of dto.items) {
        // create item
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: it.productId,
            qty: it.qty,
            price: it.price as any,
          },
        });

        // decrement stock
        const inv = await tx.inventory.upsert({
          where: { productId_branchId: { productId: it.productId, branchId: dto.branchId } },
          update: {},
          create: { productId: it.productId, branchId: dto.branchId, qtyOnHand: 0 },
        });
        const newQty = inv.qtyOnHand - it.qty;
        if (newQty < 0) throw new BadRequestException('Insufficient stock');
        await tx.inventory.update({
          where: { productId_branchId: { productId: it.productId, branchId: dto.branchId } },
          data: { qtyOnHand: newQty },
        });

        total += parseFloat(it.price) * it.qty;
      }

      await tx.order.update({ where: { id: order.id }, data: { total: String(total) as any } });

      // optional payment persistence
      if (dto.payment && dto.payment.method && dto.payment.amount) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            method: dto.payment.method,
            amount: dto.payment.amount as any,
            reference: dto.payment.reference || null,
          },
        });
      }

      return tx.order.findUnique({ where: { id: order.id }, include: { items: true, payment: true } as any });
    });
  }
}
