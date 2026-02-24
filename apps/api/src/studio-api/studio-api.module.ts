import { Module } from '@nestjs/common';
import { StudioApiController } from './studio-api.controller';
import { StudioApiService } from './studio-api.service';

@Module({
    controllers: [StudioApiController],
    providers: [StudioApiService],
})
export class StudioApiModule { }
