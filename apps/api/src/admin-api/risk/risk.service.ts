import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.riskProfile.findMany();
  }

  findOne(id: string) {
    return this.prisma.riskProfile.findUnique({ where: { id } });
  }
}
