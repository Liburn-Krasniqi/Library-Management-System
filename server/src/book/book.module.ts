import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [BookService, UserService],
  controllers: [BookController],
  // imports: [UserModule],
})
export class BookModule {}
