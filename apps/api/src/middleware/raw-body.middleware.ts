import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';

@Injectable()
export class StripeRawBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Stripe署名検証のために、該当ルートのみ生Bufferを保持するJSONパーサーを適用
        express.json({
            verify: (req: any, res, buf) => {
                req.rawBody = buf;
            },
        })(req, res, next);
    }
}
