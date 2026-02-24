import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.artistProfile.findMany();
  }

  findOne(id: string) {
    return this.prisma.artistProfile.findUnique({ where: { id } });
  }
}
