import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // stripe webhookのraw body用に全体でバッファ取得を許可するが、
        // jsonパースは通常通り行う (expressの生機能を使用)
        rawBody: true,
    });

    // CORS: 環境変数で許可オリジンを制御
    const corsOrigin = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'];
    app.enableCors({ origin: corsOrigin, credentials: true });

    // ヘルスチェックエンドポイント (Docker / ロードバランサー用)
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get('/health', (_req: any, res: any) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 API server running on port ${port}`);
}
bootstrap();

