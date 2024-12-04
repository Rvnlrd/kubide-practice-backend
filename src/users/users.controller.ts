import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('*')
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users found' })
  async getAllUser() {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async createUser(@Body() body: CreateUserDto) {
    try {
      const userExists = await this.userService.findOneByEmail(body.email);
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      return await this.userService.create(body);
    } catch (error) {
      throw new HttpException(error.driverError.detail, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'User updated' })
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.userService.findOneByEmail(email);
    return user;
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get user by name' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByName(@Param('name') name: string) {
    const user = await this.userService.findOne(name);
    return user;
  }

  @Get()
  @ApiOperation({ summary: 'Get user by isActive' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByActive(@Query('isActive', ParseBoolPipe) isActive: boolean) {
    const users = await this.userService.findByQueryParam(isActive);
    const names = users.map((user) => user.name);
    return names;
  }
}
