import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TablesService } from './tables.service';

@UseGuards(JwtAuthGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tables: TablesService) {}

  @Get()
  async list(@Query('sectionId') sectionId: string) {
    return this.tables.listBySection(sectionId);
  }

  @Put(':id/lock')
  async lock(@Param('id') id: string) {
    return this.tables.lock(id);
  }

  @Put(':id/unlock')
  async unlock(@Param('id') id: string) {
    return this.tables.unlock(id);
  }
}
