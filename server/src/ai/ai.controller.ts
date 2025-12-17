import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AiService } from './ai.service';

@UseGuards(JwtGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  async query(@Body('question') question: string) {
    return this.aiService.handleQuery(question);
  }
}
