import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async listByBranch(branchId: string) {
    return this.prisma.section.findMany({
      where: { branchId },
      orderBy: { name: 'asc' },
    });
  }
}
