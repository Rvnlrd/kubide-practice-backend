import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/guard/guard.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Endpoint para obtener notificaciones por usuario
  @Get(':userId')
  @ApiOperation({ summary: 'Get notifications by user' })
  @ApiResponse({ status: 200, description: 'Notifications found' })
  async findUserNotifications(@Param('userId') userId: number) {
    return this.notificationsService.findByUserId(userId);
  }
}
