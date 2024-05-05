import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventPricesService } from './event-prices.service';
import { CreateEventPriceDto } from './dto/create-event-price.dto';
import { UpdateEventPriceDto } from './dto/update-event-price.dto';

@Controller('event-prices')
export class EventPricesController {
  constructor(private readonly eventPricesService: EventPricesService) {}

  // @Post()
  // create(@Body() createEventPriceDto: CreateEventPriceDto) {
  //   return this.eventPricesService.create(createEventPriceDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.eventPricesService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventPricesService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventPriceDto: UpdateEventPriceDto) {
  //   return this.eventPricesService.update(+id, updateEventPriceDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventPricesService.remove(+id);
  // }
}
