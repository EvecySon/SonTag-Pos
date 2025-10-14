import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateProductDto {
  name: string;
  sku: string;
  category?: string;
  price: string; // decimal string
  taxRate?: string; // decimal string
  branchId: string;
}

interface UpdateProductDto {
  name?: string;
  sku?: string;
  category?: string;
  price?: string;
  taxRate?: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(branchId?: string) {
    return this.prisma.product.findMany({
      where: branchId ? { branchId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateProductDto, role: string) {
    if (role !== 'ADMIN' && role !== 'MANAGER') throw new ForbiddenException('Insufficient role');
    const product = await this.prisma.product.create({ data: {
      name: dto.name,
      sku: dto.sku,
      category: dto.category,
      price: dto.price as any,
      taxRate: dto.taxRate as any,
      branchId: dto.branchId,
    }});
    // ensure inventory row exists
    await this.prisma.inventory.upsert({
      where: { productId_branchId: { productId: product.id, branchId: dto.branchId } },
      create: { productId: product.id, branchId: dto.branchId, qtyOnHand: 0 },
      update: {},
    });
    return product;
  }

  async update(id: string, dto: UpdateProductDto, role: string) {
    if (role !== 'ADMIN' && role !== 'MANAGER') throw new ForbiddenException('Insufficient role');
    const exist = await this.prisma.product.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException('Product not found');
    return this.prisma.product.update({ where: { id }, data: {
      name: dto.name,
      sku: dto.sku,
      category: dto.category,
      price: dto.price as any,
      taxRate: dto.taxRate as any,
    }});
  }
}
