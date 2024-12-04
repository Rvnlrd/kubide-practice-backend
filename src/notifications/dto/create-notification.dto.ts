import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateNotificationDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  messageId: number;

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  content: string;
}
