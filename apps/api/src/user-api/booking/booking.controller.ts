import { Controller, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { UserApiService } from '../user-api.service';
import { BookingDraftDto } from './dto/booking-draft.dto';

@Controller('user-api/booking')
export class UserApiBookingController {
    constructor(private readonly userApiService: UserApiService) {}

    @Post('draft')
    async createBookingDraft(
        @Body() dto: BookingDraftDto,
        @Req() req: any
    ) {
        // 仮: 認証ユーザーID (本来はAuthGuardで取得)
        const userId = req.query.userId || dto.userId;
        if (!userId) {
            throw new BadRequestException('userId is required');
        }

        return this.userApiService.createBookingDraft(userId, dto);
    }
}
