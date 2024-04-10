import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationItemsService } from './reservation-items.service';
import { CreateReservationItemDto } from './dto/create-reservation-item.dto';
import { UpdateReservationItemDto } from './dto/update-reservation-item.dto';

@Controller('reservation-items')
export class ReservationItemsController {
  constructor(private readonly reservationItemsService: ReservationItemsService) {}

  @Post()
  create(@Body() createReservationItemDto: CreateReservationItemDto) {
    return this.reservationItemsService.create(createReservationItemDto);
  }

  @Get()
  findAll() {
    return this.reservationItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationItemDto: UpdateReservationItemDto) {
    return this.reservationItemsService.update(+id, updateReservationItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationItemsService.remove(+id);
  }
}
