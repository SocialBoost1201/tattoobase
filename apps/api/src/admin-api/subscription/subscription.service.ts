import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.subscription.findMany();
  }

  findOne(id: string) {
    return this.prisma.subscription.findUnique({ where: { id } });
  }
}
