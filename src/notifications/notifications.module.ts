import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { MessageModule } from 'src/messages/messages.module';
import { Notification } from './entities/notifications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    forwardRef(() => MessageModule),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
