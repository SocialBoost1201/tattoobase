import { Controller, Get, Param } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('admin/risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) { }

  @Get()
  findAll() {
    return this.riskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riskService.findOne(id);
  }
}
