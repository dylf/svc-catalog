import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { FindManyOptions, ILike } from 'typeorm';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 12,
    @Query('sort') sort?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    limit = limit > 100 ? 100 : limit;

    const options: FindManyOptions<Service> = {
      take: limit,
      skip: (page - 1) * limit,
      order: sort ? { [sort]: order } : { id: 'ASC' },
      // Can we just pull a count via the ORM?
      relations: ['versions'],
    };

    if (search) {
      options.where = { name: ILike(`%${search}%`) };
    }

    const [services, total] = await this.servicesService.findAll(options);

    const data = services.map((service) => {
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        url: '/services/' + service.id,
        version_count: service.versions.length,
      };
    });

    return {
      data: data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @Get(':id/versions')
  async findVersions(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id, {
      relations: ['versions'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service.versions;
  }
}
