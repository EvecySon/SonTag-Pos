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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TablesService = class TablesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listBySection(sectionId) {
        return this.prisma.table.findMany({ where: { sectionId }, orderBy: { name: 'asc' } });
    }
    async lock(id) {
        const t = await this.prisma.table.findUnique({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException('Table not found');
        if (t.status === 'locked')
            throw new common_1.BadRequestException('Already locked');
        return this.prisma.table.update({ where: { id }, data: { status: 'locked' } });
    }
    async unlock(id) {
        const t = await this.prisma.table.findUnique({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException('Table not found');
        if (t.status !== 'locked')
            throw new common_1.BadRequestException('Not locked');
        return this.prisma.table.update({ where: { id }, data: { status: 'available' } });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablesService);
//# sourceMappingURL=tables.service.js.map