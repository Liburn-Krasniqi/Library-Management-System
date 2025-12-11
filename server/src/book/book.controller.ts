import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard'; // adjust path if needed
import { GetUser } from 'src/auth/decorator/get-user.decorator'; // adjust path

// duhna me i ra nfije qysh me perdor GET http://localhost:3333/users/me per me i marr tdhanat e userit qe tani me request mi kqur librat (done)
// duhna me e bo ni front per librat (muj me i perdor custom tables, forms edhe pagination prej HMS)
// qiky controller osht krejt genAi dmth ruju

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@GetUser('sub') userId: string, @Body() dto: any) {
    return this.bookService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('sub') userId: string) {
    return this.bookService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('sub') userId: string, @Param('id') id: string) {
    return this.bookService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.bookService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@GetUser('sub') userId: string, @Param('id') id: string) {
    return this.bookService.remove(userId, id);
  }
}
