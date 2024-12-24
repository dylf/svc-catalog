import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { FindManyOptions, ILike } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ServicesQueryDto } from './dto/services-query.dto';
import {
  badRequestResponseSchema,
  metaResponseSchema,
  serviceResponseSchema,
} from './schemas/openapi-schemas';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List all services' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: serviceResponseSchema,
        },
        meta: metaResponseSchema,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
    schema: badRequestResponseSchema,
  })
  async findAll(@Query() query: ServicesQueryDto) {
    const { page = 1, search } = query;
    let { limit = 50 } = query;
    limit = limit > 100 ? 100 : limit;

    const options: FindManyOptions<Service> = {
      take: limit,
      skip: (page - 1) * limit,
      relations: ['versions'],
    };

    if (search) {
      options.where = [
        { name: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ];
    }

    const [services, total] = await this.servicesService.findAll(options);

    const data = services.map((service) => {
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        url: service.url,
        version_count: service.versions.length,
      };
    });

    return {
      data: data,
      meta: {
        total,
        page,
        page_size: limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: serviceResponseSchema,
        meta: { type: 'object' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
    schema: badRequestResponseSchema,
  })
  async findOne(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return {
      data: {
        id: service.id,
        name: service.name,
        description: service.description,
        url: service.url,
        version_count: service.versions.length,
      },
      meta: {},
    };
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'List all versions for a service' })
  @ApiBadRequestResponse({
    description: 'Invalid request',
    schema: badRequestResponseSchema,
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              version: { type: 'string' },
              description: { type: 'string' },
              url: { type: 'string' },
            },
          },
        },
        meta: metaResponseSchema,
      },
    },
  })
  async findVersions(
    @Param('id') id: string,
    @Query() query: PaginationQueryDto,
  ) {
    const { page = 1, limit = 50 } = query;
    const service = await this.servicesService.findOne(id, {
      relations: ['versions'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    const [serviceVersions, total] = await this.servicesService.findVersions(
      id,
      {
        take: limit,
        skip: (page - 1) * limit,
      },
    );
    const data = serviceVersions.map((v) => {
      return {
        id: v.id,
        version: v.version,
        description: v.description,
        url: v.url,
      };
    });
    return {
      data: data,
      meta: {
        total: total,
        page,
        page_size: limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }
}
