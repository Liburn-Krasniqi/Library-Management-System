// recommendations.controller.ts (Updated)
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @UseGuards(JwtGuard)
  @Get('personalized')
  async getPersonalized(
    @Req() req,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const userId = req.user.id; // This should be a string (cuid)
    return this.recommendationsService.getRecommendationsForUser(
      userId,
      limit || 8,
    );
  }

  @UseGuards(JwtGuard)
  @Post('add-to-library')
  @HttpCode(HttpStatus.CREATED)
  async addToLibrary(
    @Req() req,
    @Body()
    body: {
      displayBookId: number;
      status?: 'READING' | 'COMPLETED' | 'WANT_TO_READ' | 'DROPPED';
    },
  ) {
    const userId = req.user.id;
    return this.recommendationsService.addBookToUserLibrary(
      userId,
      body.displayBookId,
      body.status || 'WANT_TO_READ',
    );
  }
}
