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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(branchId) {
        return this.prisma.product.findMany({
            where: branchId ? { branchId } : undefined,
            orderBy: { name: 'asc' },
        });
    }
    async create(dto, role) {
        if (role !== 'ADMIN' && role !== 'MANAGER')
            throw new common_1.ForbiddenException('Insufficient role');
        const product = await this.prisma.product.create({ data: {
                name: dto.name,
                sku: dto.sku,
                category: dto.category,
                price: dto.price,
                taxRate: dto.taxRate,
                branchId: dto.branchId,
            } });
        await this.prisma.inventory.upsert({
            where: { productId_branchId: { productId: product.id, branchId: dto.branchId } },
            create: { productId: product.id, branchId: dto.branchId, qtyOnHand: 0 },
            update: {},
        });
        return product;
    }
    async update(id, dto, role) {
        if (role !== 'ADMIN' && role !== 'MANAGER')
            throw new common_1.ForbiddenException('Insufficient role');
        const exist = await this.prisma.product.findUnique({ where: { id } });
        if (!exist)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.product.update({ where: { id }, data: {
                name: dto.name,
                sku: dto.sku,
                category: dto.category,
                price: dto.price,
                taxRate: dto.taxRate,
            } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map