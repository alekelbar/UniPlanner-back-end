import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Controller('deliverables')
export class DeliverablesController {
  constructor(private readonly deliverablesService: DeliverablesService) {}

  @Post()
  create(@Body() createDeliverableDto: CreateDeliverableDto) {
    return this.deliverablesService.create(createDeliverableDto);
  }

  @Get()
  findAll() {
    return this.deliverablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliverablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliverableDto: UpdateDeliverableDto) {
    return this.deliverablesService.update(+id, updateDeliverableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliverablesService.remove(+id);
  }
}
