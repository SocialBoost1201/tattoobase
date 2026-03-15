import { IsString, IsOptional, IsObject, IsDateString } from 'class-validator';

export class BookingDraftDto {
    @IsString()
    studioId: string;

    @IsOptional()
    @IsString()
    artistId?: string;

    @IsOptional()
    @IsDateString()
    scheduledAtLocal?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsObject()
    briefJson: Record<string, any>;

    @IsOptional()
    @IsString()
    userId?: string; // テスト用
}
