import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, senderId, receiverId } = createMessageDto;

    const message = this.messageRepository.create({
      content,
      sender: { id: senderId } as User,
      receiver: { id: receiverId } as User,
    });
    const savedMessage = await this.messageRepository.save(message);

    await this.notificationsService.createNotification({
      userId: receiverId,
      messageId: savedMessage.id,
      content: `You have a new message from ${senderId}`,
    });

    return savedMessage;
  }

  findMessagesByUserId(userId: number): Promise<Message[]> {
    if (!userId) throw new Error('User ID is required');

    return this.messageRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      select: ['id', 'content', 'createdAt', 'sender'],
    });
  }
}
