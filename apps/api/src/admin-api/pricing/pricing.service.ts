import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.pricingSnapshot.findMany();
  }

  findOne(id: string) {
    return this.prisma.pricingSnapshot.findUnique({ where: { id } });
  }
}
