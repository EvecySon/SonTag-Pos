import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AdjustStockDto {
  delta: number; // positive to add, negative to remove
}

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async listByBranch(branchId: string) {
    return this.prisma.inventory.findMany({
      where: { branchId },
      include: { product: true },
      orderBy: { product: { name: 'asc' } },
    });
  }

  async adjust(productId: string, branchId: string, dto: AdjustStockDto, role: string) {
    if (role !== 'ADMIN' && role !== 'MANAGER') throw new ForbiddenException('Insufficient role');

    // Ensure inventory row exists
    const inv = await this.prisma.inventory.upsert({
      where: { productId_branchId: { productId, branchId } },
      update: {},
      create: { productId, branchId, qtyOnHand: 0 },
    });

    const newQty = inv.qtyOnHand + (dto.delta || 0);
    if (newQty < 0) throw new NotFoundException('Insufficient stock');

    return this.prisma.inventory.update({
      where: { productId_branchId: { productId, branchId } },
      data: { qtyOnHand: newQty },
    });
  }
}
