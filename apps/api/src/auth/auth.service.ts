import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface StudioRegisterDto {
  studioName: string;
  ownerName: string;
  email: string;
  phoneNumber?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  description?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerStudio(dto: StudioRegisterDto) {
    const existing = await this.prisma.staff.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('このメールアドレスは既に登録されています');

    const slug = this.generateSlug(dto.studioName);

    return this.prisma.$transaction(async (tx) => {
      const studio = await tx.studio.create({
        data: {
          name: dto.studioName,
          slug: await this.uniqueSlug(slug, tx),
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          prefecture: dto.prefecture,
          city: dto.city,
          address: dto.address,
          description: dto.description,
          onboardingCompleted: false,
        },
      });

      const staff = await tx.staff.create({
        data: {
          studioId: studio.id,
          displayName: dto.ownerName,
          email: dto.email,
          role: 'owner',
        },
      });

      await tx.subscription.create({
        data: {
          studioId: studio.id,
          status: 'trial',
          graceUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180日間無料
        },
      });

      return { studioId: studio.id, staffId: staff.id, slug: studio.slug };
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[\s　]+/g, '-')
      .replace(/[^\w\-]/g, '')
      .slice(0, 40) || 'studio';
  }

  private async uniqueSlug(base: string, tx: any): Promise<string> {
    let slug = base;
    let i = 1;
    while (await tx.studio.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }
    return slug;
  }
}
