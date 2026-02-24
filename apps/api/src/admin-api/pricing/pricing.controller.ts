import { Controller, Get, Param } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('admin/pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) { }

  @Get()
  findAll() {
    return this.pricingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricingService.findOne(id);
  }
}
