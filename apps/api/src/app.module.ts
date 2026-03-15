import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { StripeRawBodyMiddleware } from './middleware/raw-body.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { DomainModule } from './domain/domain.module';
import { PaymentsModule } from './payments/payments.module';
import { RiskModule } from './admin-api/risk/risk.module';
import { DesignModule } from './admin-api/design/design.module';
import { PricingModule } from './admin-api/pricing/pricing.module';
import { SubscriptionModule } from './admin-api/subscription/subscription.module';
import { ArtistModule } from './admin-api/artist/artist.module';
import { UserApiModule } from './user-api/user-api.module';
import { StudioApiModule } from './studio-api/studio-api.module';
import { AdminApiModule } from './admin-api/admin-api.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

@Module({
    imports: [
        PrismaModule, DomainModule, PaymentsModule,
        // 旧 admin-api 個別モジュール (Read-only endpoints for model inspection)
        RiskModule, DesignModule, PricingModule, SubscriptionModule, ArtistModule,
        // フロントエンド向けドメイン別 API モジュール
        UserApiModule, StudioApiModule, AdminApiModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditLogInterceptor,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // 1. request-id を全ルートにバインド
        consumer.apply(RequestIdMiddleware).forRoutes('*');
        // 2. stripe webhook にのみ raw body パースを適用
        consumer.apply(StripeRawBodyMiddleware).forRoutes({
            path: 'payments/webhook',
            method: RequestMethod.POST,
        });
    }
}
