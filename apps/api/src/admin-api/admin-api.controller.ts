import { Controller, Get, Param, Query, Post, Body, Patch, Delete } from '@nestjs/common';
import { AdminApiService } from './admin-api.service';

/**
 * AdminApiController
 * - 全エンドポイントは将来的に @UseGuards(JwtAuthGuard, AdminRoleGuard) で保護する
 * - 読み取りのみ。POST/PATCH/DELETE は設計上存在しない
 */
@Controller('admin-api')
export class AdminApiController {
    constructor(private readonly adminApiService: AdminApiService) { }

    @Get('dashboard')
    getDashboard() {
        return this.adminApiService.getDashboard();
    }

    @Get('kyc')
    getKycQueue() {
        return this.adminApiService.getKycQueue();
    }

    @Get('kyc/:id')
    getKycDetail(@Param('id') id: string) {
        return this.adminApiService.getKycDetail(id);
    }

    @Post('kyc/:id/process')
    processKyc(
        @Param('id') id: string,
        @Body() body: { action: 'APPROVE' | 'REJECT', reviewerId: string }
    ) {
        return this.adminApiService.processKyc(id, body.action, body.reviewerId);
    }

    @Get('webhooks')
    getWebhooks() {
        return this.adminApiService.getWebhooks();
    }

    @Get('audit')
    getAuditLogs(
        @Query('entityType') entityType?: string,
        @Query('actorId') actorId?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminApiService.getAuditLogs({
            entityType,
            actorId,
            limit: limit ? parseInt(limit, 10) : undefined,
        });
    }

    @Get('risk')
    getRiskMonitor() {
        return this.adminApiService.getRiskMonitor();
    }

    @Get('studios')
    getStudios() {
        return this.adminApiService.getStudios();
    }

    @Get('studios/:id')
    getStudio(@Param('id') id: string) {
        return this.adminApiService.getStudio(id);
    }

    @Get('incidents')
    getIncidents() {
        return this.adminApiService.getIncidents();
    }

    @Get('reports')
    getReports() {
        return this.adminApiService.getReports();
    }

    // --- Facilities ---
    @Get('facilities')
    getFacilities() {
        return this.adminApiService.getFacilities();
    }

    @Get('facilities/:id')
    getFacility(@Param('id') id: string) {
        return this.adminApiService.getFacility(id);
    }

    @Post('facilities')
    createFacility(@Body() body: any) {
        return this.adminApiService.createFacility(body);
    }

    @Patch('facilities/:id')
    updateFacility(@Param('id') id: string, @Body() body: any) {
        return this.adminApiService.updateFacility(id, body);
    }

    @Delete('facilities/:id')
    deleteFacility(@Param('id') id: string) {
        return this.adminApiService.deleteFacility(id);
    }

    // --- Facility Reports (UGC) ---
    @Get('facility-reports/pending')
    getPendingFacilityReports() {
        return this.adminApiService.getPendingFacilityReports();
    }

    @Post('facility-reports/:id/process')
    processFacilityReport(
        @Param('id') id: string,
        @Body() body: { action: 'APPROVE' | 'REJECT', adminNote?: string }
    ) {
        return this.adminApiService.processFacilityReport(id, body.action, body.adminNote);
    }
}
