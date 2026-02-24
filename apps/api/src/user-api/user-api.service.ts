import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserApiService {
    constructor(private readonly prisma: PrismaService) { }

    // --- Artists ---
    getArtists() {
        return this.prisma.artistProfile.findMany({
            include: { studio: true }
        });
    }

    getArtistMeta(id: string) {
        return this.prisma.artistProfile.findUnique({
            where: { id },
            include: { studio: true, portfolioWorks: true }
        });
    }

    // --- Studios ---
    getStudios() {
        return this.prisma.studio.findMany({
            where: { accountType: { not: 'CUSTOM' } }
        });
    }

    getStudioMeta(id: string) {
        return this.prisma.studio.findUnique({
            where: { id },
            include: { staffs: true, artists: true }
        });
    }

    // --- Portfolios ---
    getPortfolios() {
        return this.prisma.portfolioWork.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { artist: true }
        });
    }

    getPortfolio(id: string) {
        return this.prisma.portfolioWork.findUnique({
            where: { id },
            include: { artist: true, studio: true }
        });
    }

    // --- Account Data ---
    getUserProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { riskProfile: true }
        });
    }

    getUserBookings(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { artist: true, studio: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    getBookingDetail(id: string) {
        return this.prisma.booking.findUnique({
            where: { id },
            include: { artist: true, studio: true, payments: true }
        });
    }

    getUserDesigns(userId: string) {
        return this.prisma.designRequest.findMany({
            where: { userId },
            include: { artist: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    getDesignDetail(id: string) {
        return this.prisma.designRequest.findUnique({
            where: { id },
            include: { artist: true, designAssets: true }
        });
    }
}
