import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { StudioApiService } from './studio-api.service';

/**
 * StudioApiController
 * - 全エンドポイントは将来的に @UseGuards(JwtAuthGuard, StudioTenantGuard) で保護する
 * - 現在は MVP として studioId を Query Parameter から受け取る
 */
@Controller('studio-api')
export class StudioApiController {
    constructor(private readonly studioApiService: StudioApiService) { }

    @Get('dashboard')
    getDashboard(@Query('studioId') studioId: string) {
        return this.studioApiService.getDashboard(studioId);
    }

    @Get('bookings')
    getBookings(@Query('studioId') studioId: string) {
        return this.studioApiService.getBookings(studioId);
    }

    @Get('bookings/:id')
    getBooking(@Query('studioId') studioId: string, @Param('id') id: string) {
        return this.studioApiService.getBooking(studioId, id);
    }

    @Get('designs')
    getDesigns(@Query('studioId') studioId: string) {
        return this.studioApiService.getDesigns(studioId);
    }

    @Get('designs/:id')
    getDesign(@Query('studioId') studioId: string, @Param('id') id: string) {
        return this.studioApiService.getDesign(studioId, id);
    }

    @Get('artists')
    getArtists(@Query('studioId') studioId: string) {
        return this.studioApiService.getArtists(studioId);
    }

    @Put('artists/:id')
    updateArtist(
        @Query('studioId') studioId: string, 
        @Param('id') id: string,
        @Body() data: any
    ) {
        return this.studioApiService.updateArtist(studioId, id, data);
    }

    @Get('portfolio')
    getPortfolio(@Query('studioId') studioId: string) {
        return this.studioApiService.getPortfolio(studioId);
    }

    @Post('portfolio')
    createPortfolio(
        @Query('studioId') studioId: string, 
        @Body() data: any
    ) {
        return this.studioApiService.createPortfolioWork(studioId, data);
    }

    @Get('billing')
    getBilling(@Query('studioId') studioId: string) {
        return this.studioApiService.getBilling(studioId);
    }

    @Get('risk')
    getRisk(@Query('studioId') studioId: string) {
        return this.studioApiService.getRisk(studioId);
    }

    @Post('bookings/:id/approve')
    approveBooking(@Query('studioId') studioId: string, @Param('id') id: string) {
        return this.studioApiService.approveBooking(studioId, id);
    }

    @Post('bookings/:id/reject')
    rejectBooking(@Query('studioId') studioId: string, @Param('id') id: string) {
        return this.studioApiService.rejectBooking(studioId, id);
    }

    // --- Settings (Deposit) ---
    @Get('settings/deposit')
    getDepositSettings(@Query('studioId') studioId: string) {
        return this.studioApiService.getDepositSettings(studioId);
    }

    @Put('settings/deposit')
    updateDepositSettings(
        @Query('studioId') studioId: string,
        @Body() body: { requiresDeposit: boolean, depositAmount: number }
    ) {
        return this.studioApiService.updateDepositSettings(studioId, body);
    }
}
