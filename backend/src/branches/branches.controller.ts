import { Body, Controller, Get, Post, Put, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BranchesService } from './branches.service';

class CreateBranchDto {
  name!: string;
  location!: string;
}

class UpdateBranchDto {
  name?: string;
  location?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async list() {
    return this.branchesService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateBranchDto, @Req() req: any) {
    return this.branchesService.create(dto, req.user?.role);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBranchDto, @Req() req: any) {
    return this.branchesService.update(id, dto, req.user?.role);
  }
}
