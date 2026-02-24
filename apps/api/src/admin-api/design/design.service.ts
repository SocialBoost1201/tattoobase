import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DesignService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.designRequest.findMany();
  }

  findOne(id: string) {
    return this.prisma.designRequest.findUnique({ where: { id } });
  }
}
