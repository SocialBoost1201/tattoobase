"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const request_id_middleware_1 = require("./middleware/request-id.middleware");
const raw_body_middleware_1 = require("./middleware/raw-body.middleware");
const prisma_module_1 = require("./prisma/prisma.module");
const domain_module_1 = require("./domain/domain.module");
const payments_module_1 = require("./payments/payments.module");
const risk_module_1 = require("./admin-api/risk/risk.module");
const design_module_1 = require("./admin-api/design/design.module");
const pricing_module_1 = require("./admin-api/pricing/pricing.module");
const subscription_module_1 = require("./admin-api/subscription/subscription.module");
const artist_module_1 = require("./admin-api/artist/artist.module");
const user_api_module_1 = require("./user-api/user-api.module");
const studio_api_module_1 = require("./studio-api/studio-api.module");
const admin_api_module_1 = require("./admin-api/admin-api.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware).forRoutes('*');
        consumer.apply(raw_body_middleware_1.StripeRawBodyMiddleware).forRoutes({
            path: 'payments/webhook',
            method: common_1.RequestMethod.POST,
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule, domain_module_1.DomainModule, payments_module_1.PaymentsModule,
            risk_module_1.RiskModule, design_module_1.DesignModule, pricing_module_1.PricingModule, subscription_module_1.SubscriptionModule, artist_module_1.ArtistModule,
            user_api_module_1.UserApiModule, studio_api_module_1.StudioApiModule, admin_api_module_1.AdminApiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map