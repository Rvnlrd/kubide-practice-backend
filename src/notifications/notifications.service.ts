import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notifications.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Message } from 'src/messages/entities/message.entity';
import { MessageService } from 'src/messages/messages.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const { userId, messageId, content } = createNotificationDto;

    const notification = this.notificationRepository.create({
      user: { id: userId } as any,
      message: { id: messageId } as any,
      content,
    });

    return this.notificationRepository.save(notification);
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      relations: ['message'],
    });
  }
}
