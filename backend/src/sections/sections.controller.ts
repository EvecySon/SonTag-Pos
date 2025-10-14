import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SectionsService } from './sections.service';

@UseGuards(JwtAuthGuard)
@Controller('sections')
export class SectionsController {
  constructor(private readonly sections: SectionsService) {}

  @Get()
  async list(@Query('branchId') branchId: string) {
    return this.sections.listByBranch(branchId);
  }
}
