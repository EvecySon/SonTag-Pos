"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(branchId, from, to) {
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
    async create(dto, userId) {
        if (!dto.items?.length)
            throw new common_1.BadRequestException('No items');
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    branchId: dto.branchId,
                    userId: userId || null,
                    status: 'PAID',
                    total: '0',
                },
            });
            let total = 0;
            for (const it of dto.items) {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: it.productId,
                        qty: it.qty,
                        price: it.price,
                    },
                });
                const inv = await tx.inventory.upsert({
                    where: { productId_branchId: { productId: it.productId, branchId: dto.branchId } },
                    update: {},
                    create: { productId: it.productId, branchId: dto.branchId, qtyOnHand: 0 },
                });
                const newQty = inv.qtyOnHand - it.qty;
                if (newQty < 0)
                    throw new common_1.BadRequestException('Insufficient stock');
                await tx.inventory.update({
                    where: { productId_branchId: { productId: it.productId, branchId: dto.branchId } },
                    data: { qtyOnHand: newQty },
                });
                total += parseFloat(it.price) * it.qty;
            }
            await tx.order.update({ where: { id: order.id }, data: { total: String(total) } });
            if (dto.payment && dto.payment.method && dto.payment.amount) {
                await tx.payment.create({
                    data: {
                        orderId: order.id,
                        method: dto.payment.method,
                        amount: dto.payment.amount,
                        reference: dto.payment.reference || null,
                    },
                });
            }
            return tx.order.findUnique({ where: { id: order.id }, include: { items: true, payment: true } });
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map