import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Query } from '@nestjs/common';


@UseGuards(JwtAuthGuard)
@Controller('deliverables')
export class DeliverablesController {
  constructor(private readonly deliverablesService: DeliverablesService) {}

  @Post()
  create(@Body() createDeliverableDto: CreateDeliverableDto) {
    return this.deliverablesService.create(createDeliverableDto);
  }

  @Get()
  findAll(@Query('page') page: number = 0) {
    return this.deliverablesService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.deliverablesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateDeliverableDto: UpdateDeliverableDto,
  ) {
    return this.deliverablesService.update(id, updateDeliverableDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.deliverablesService.remove(id);
  }
}
