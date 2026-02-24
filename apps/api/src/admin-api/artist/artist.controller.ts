import { Controller, Get, Param } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('admin/artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }
}
