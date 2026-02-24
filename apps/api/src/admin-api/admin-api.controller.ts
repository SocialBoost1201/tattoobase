import { Controller, Get, Param, Query } from '@nestjs/common';
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
}
