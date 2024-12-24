import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceVersion } from './entities/service-version.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(ServiceVersion)
    private serviceVersionsRepository: Repository<ServiceVersion>,
  ) {}

  findAll(options: FindManyOptions<Service>): Promise<[Service[], number]> {
    return this.servicesRepository.findAndCount(options);
  }

  findOne(
    id: string,
    options: FindManyOptions<Service> = { relations: ['versions'] },
  ): Promise<Service | null> {
    return this.servicesRepository.findOne({ where: { id }, ...options });
  }

  findVersions(
    id: string,
    options: FindManyOptions<ServiceVersion>,
  ): Promise<[ServiceVersion[], number]> {
    return this.serviceVersionsRepository.findAndCount({
      ...options,
      where: { service: { id } },
      order: { version: 'DESC' },
    });
  }
}
