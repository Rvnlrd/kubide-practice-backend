import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserService } from '../users/users.service';
import { AuthGuard } from 'src/auth/guard/guard.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('message')
@Controller('message')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Send message' })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async sendMessage(@Body() body: CreateMessageDto) {
    const receiver = await this.userService.findOneById(body.receiverId);
    if (!receiver) throw new BadRequestException('Receiver not found');
    if (!receiver.active)
      throw new ForbiddenException('Receiver is not active');

    const message: CreateMessageDto = {
      content: body.content,
      senderId: body.senderId,
      receiverId: receiver.id,
    };

    return await this.messageService.create(message);
  }
  @Get(':userId')
  @ApiOperation({ summary: 'Get messages by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Messages found successfully.',
  })
  async getMessagesByUserId(@Param('userId') userId: number) {
    if (!userId) throw new Error('User ID is required');

    return await this.messageService.findMessagesByUserId(userId);
  }
}
