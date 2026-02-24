import { Controller, Get, Param } from '@nestjs/common';
import { DesignService } from './design.service';

@Controller('admin/design')
export class DesignController {
  constructor(private readonly designService: DesignService) { }

  @Get()
  findAll() {
    return this.designService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.designService.findOne(id);
  }
}
