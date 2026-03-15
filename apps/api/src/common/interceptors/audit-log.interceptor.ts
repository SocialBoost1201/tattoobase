import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, query, headers } = req;

        // 更新系メソッドのみを対象とする
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            return next.handle();
        }

        // 簡易的なユーザー識別 (本来は request.user から取得)
        const actorId = query?.userId || headers['x-user-id'] || req.user?.id || 'anonymous';
        const actorType = req.user?.role || 'user';
        const requestId = req.id || headers['x-request-id'] || 'unknown';

        const beforeJson = method !== 'POST' ? null : null; // 本来は変更前の状態を取得するが今回は省略（MVP）

        return next.handle().pipe(
            tap(async (responseBody) => {
                try {
                    // 非同期でDBに書き込む
                    await this.prisma.auditLog.create({
                        data: {
                            actorType,
                            actorId,
                            entityType: url.split('?')[0], // エンドポイントをエンティティ種別として仮置き
                            entityId: 'N/A', // URLパラメータ等から本来は抽出
                            action: method,
                            beforeJson: method !== 'POST' ? {} : undefined,
                            afterJson: body || {}, // リクエスト時のペイロードを記録
                            requestId,
                        },
                    });
                } catch (error) {
                    console.error('Failed to write audit log:', error);
                }
            })
        );
    }
}
