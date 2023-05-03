import {
  Controller,
  Get,
  Post,
  Body, Param,
  Delete,
  Query
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get(':id')
  findAllFromUser(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('page') page: number,
  ) {
    return this.sessionsService.findAllFromUser(id, page);
  }

  @Get('all/:user')
  getAll(@Param('user', ParseMongoIdPipe) user: string){
    return this.sessionsService.getAll(user);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.sessionsService.remove(id);
  }
}
