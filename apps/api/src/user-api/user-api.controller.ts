import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { UserApiService } from './user-api.service';

@Controller('user-api')
export class UserApiController {
    constructor(private readonly userApiService: UserApiService) { }

    @Get('artists')
    getArtists(
        @Query('genre') genre?: string,
        @Query('gender') gender?: string
    ) { 
        return this.userApiService.getArtists({ genre, gender }); 
    }

    @Get('artists/:id')
    getArtist(@Param('id') id: string) { return this.userApiService.getArtistMeta(id); }

    @Get('studios')
    getStudios() { return this.userApiService.getStudios(); }

    @Get('studios/:id')
    getStudio(@Param('id') id: string) { return this.userApiService.getStudioMeta(id); }

    @Get('portfolios')
    getPortfolios() { return this.userApiService.getPortfolios(); }

    @Get('portfolios/:id')
    getPortfolio(@Param('id') id: string) { return this.userApiService.getPortfolio(id); }

    // 認証(Request.user)の代用としてQuery Parameterを使用
    @Get('account')
    getAccount(@Query('userId') userId: string) { return this.userApiService.getUserProfile(userId); }

    @Get('account/bookings')
    getAccountBookings(@Query('userId') userId: string) { return this.userApiService.getUserBookings(userId); }

    @Get('account/designs')
    getAccountDesigns(@Query('userId') userId: string) { return this.userApiService.getUserDesigns(userId); }

    @Get('bookings/:id')
    getBooking(@Param('id') id: string) { return this.userApiService.getBookingDetail(id); }

    @Get('designs/:id')
    getDesign(@Param('id') id: string) { return this.userApiService.getDesignDetail(id); }

    // --- KYC ---
    @Post('account/kyc')
    submitKyc(
        @Query('userId') userId: string,
        @Body() body: { encryptedFilePath: string, birthDate: string }
    ) {
        return this.userApiService.submitKyc(userId, body);
    }

    // --- Facilities ---
    @Get('facilities')
    getFacilities(
        @Query('type') type?: string, 
        @Query('area') area?: string,
        @Query('acceptanceLevel') acceptanceLevel?: string,
        @Query('includeBanned') includeBanned?: string
    ) {
        return this.userApiService.getFacilities({ 
            type, 
            area, 
            acceptanceLevel, 
            includeBanned: includeBanned === 'true' 
        });
    }

    @Get('facilities/:slugOrId')
    getFacility(@Param('slugOrId') slugOrId: string) {
        return this.userApiService.getFacilityMeta(slugOrId);
    }

    @Post('facilities/:id/reports')
    createFacilityReport(
        @Param('id') facilityId: string,
        @Body() body: {
            userId?: string;
            reportedLevel: string;
            evidenceText?: string;
            evidenceUrl?: string;
        }
    ) {
        return this.userApiService.createFacilityReport({
            ...body,
            facilityId,
        });
    }
}
