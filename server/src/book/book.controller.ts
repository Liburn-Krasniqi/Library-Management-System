import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UserService } from 'src/user/user.service';
import { Role } from 'generated/prisma/enums';

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private userService: UserService,
  ) {}

  // Admin-only: Get all books for a specific user
  @Get('user/:userId')
  async getUserBooks(
    @GetUser('id') requesterId: string,
    @Param('userId') userId: string,
  ) {
    // Check if requester is admin
    const requester = await this.userService.getUserRole(requesterId);
    if (requester !== Role.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

    return this.bookService.findAll(userId);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.bookService.findAll(userId);
  }

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateBookDto) {
    return this.bookService.create(userId, dto);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.bookService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.bookService.update(userId, id, dto);
  }
  @Patch('admin/books/:bookId/user/:userId')
  async updateFromAdmin(
    @GetUser('id') requesterId: string,
    @Param('bookId') bookId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateBookDto,
  ) {
    const role = await this.userService.getUserRole(requesterId);
    if (role !== Role.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

    return this.bookService.updateAsAdmin(userId, bookId, dto);
  }
  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.bookService.remove(userId, id);
  }
  // @UseGuards(JwtGuard, AdminGuard)
  @Delete('admin/books/:bookId/user/:userId')
  removeFromAdmin(
    @Param('bookId') bookId: string,
    @Param('userId') userId: string,
  ) {
    return this.bookService.removeAsAdmin(userId, bookId);
  }
}
