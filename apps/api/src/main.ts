import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // stripe webhookのraw body用に全体でバッファ取得を許可するが、
        // jsonパースは通常通り行う (expressの生機能を使用)
        rawBody: true,
    });
    await app.listen(3000);
}
bootstrap();
