import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async listBySection(sectionId: string) {
    return this.prisma.table.findMany({ where: { sectionId }, orderBy: { name: 'asc' } });
  }

  async lock(id: string) {
    const t = await this.prisma.table.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Table not found');
    if (t.status === 'locked') throw new BadRequestException('Already locked');
    return this.prisma.table.update({ where: { id }, data: { status: 'locked' } });
  }

  async unlock(id: string) {
    const t = await this.prisma.table.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Table not found');
    if (t.status !== 'locked') throw new BadRequestException('Not locked');
    return this.prisma.table.update({ where: { id }, data: { status: 'available' } });
  }
}
