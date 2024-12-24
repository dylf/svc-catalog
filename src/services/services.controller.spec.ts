import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ServiceVersion } from './entities/service-version.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ServicesController', () => {
  let app: INestApplication;
  let service: ServicesService;
  let servicesRepository: Repository<Service>;
  let serviceVersionsRepository: Repository<ServiceVersion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServiceVersion),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    servicesRepository = module.get<Repository<Service>>(
      getRepositoryToken(Service),
    );
    serviceVersionsRepository = module.get<Repository<ServiceVersion>>(
      getRepositoryToken(ServiceVersion),
    );

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GET /services', () => {
    it('should return an array of services', async () => {
      const mockServices: Service[] = [
        {
          id: 'uuid-1',
          name: 'Service 1',
          description: 'Description 1',
          url: 'http://localhost/api/',
          // @ts-expect-error type expects service ref but we are mocking it
          versions: [0, 1, 2, 3].map((i) => ({
            id: `version-uuid-${i}`,
            version: `1.0.${i}`,
            service: 'uuid-1',
            description: 'Description 1',
            url: `http://localhost/api/v1.0.${i}/`,
          })),
          author: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'published',
        },
        {
          id: 'uuid-2',
          name: 'Service 2',
          description: 'Description 2',
          url: 'http://someother.domain/api/',
          versions: [],
          author: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'published',
        },
      ];
      jest
        .spyOn(servicesRepository, 'findAndCount')
        .mockResolvedValue([mockServices, mockServices.length]);

      const response = await request(app.getHttpServer()).get(
        '/services?limit=20',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        meta: {
          total: 2,
          page: 1,
          page_size: 20,
          last_page: 1,
        },
        data: [
          {
            id: 'uuid-1',
            name: 'Service 1',
            description: 'Description 1',
            url: 'http://localhost/api/',
            version_count: 4,
          },
          {
            id: 'uuid-2',
            name: 'Service 2',
            description: 'Description 2',
            url: 'http://someother.domain/api/',
            version_count: 0,
          },
        ],
      });
    });

    it('should return an bad response with a bad limit', async () => {
      let response = await request(app.getHttpServer()).get(
        '/services?limit=bad',
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'limit must not be greater than 100',
          'limit must not be less than 1',
          'limit must be an integer number',
        ],
        error: 'Bad Request',
      });

      response = await request(app.getHttpServer()).get('/services?limit=999');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['limit must not be greater than 100'],
        error: 'Bad Request',
      });

      response = await request(app.getHttpServer()).get('/services?limit=-1');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['limit must not be less than 1'],
        error: 'Bad Request',
      });
    });

    it('should return an bad response with a bad page', async () => {
      let response = await request(app.getHttpServer()).get(
        '/services?page=bad',
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'page must not be less than 1',
          'page must be an integer number',
        ],
        error: 'Bad Request',
      });

      response = await request(app.getHttpServer()).get('/services?page=-1');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['page must not be less than 1'],
        error: 'Bad Request',
      });
    });
  });

  describe('GET /services/:id', () => {
    it('should return a service by id', async () => {
      const mockService: Service = {
        id: 'uuid-1',
        name: 'Service 1',
        description: 'Description 1',
        url: 'http://localhost/api/',
        versions: [],
        author: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
      };
      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(mockService);

      const response = await request(app.getHttpServer()).get(
        '/services/uuid-1',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        meta: {},
        data: {
          id: 'uuid-1',
          name: 'Service 1',
          description: 'Description 1',
          url: 'http://localhost/api/',
          version_count: 0,
        },
      });
    });

    it('should return 404 if service is not found', async () => {
      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get(
        '/services/non-existent-uuid',
      );

      expect(response.status).toBe(404);
    });
  });

  describe('GET /services/:id/versions', () => {
    it('should return versions for a service', async () => {
      const mockService: Service = {
        id: 'uuid-1',
        name: 'Service 1',
        description: 'Description 1',
        url: 'http://localhost/api/',
        author: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        versions: [
          {
            id: 'version-uuid-2',
            version: '1.0.1',
            // @ts-expect-error type expects service ref but we are mocking it
            service: 'uuid-1',
            description: 'Description 1',
            url: 'http://localhost/api/v1.0.1/',
            author: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'published',
          },
        ],
      };

      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(mockService);
      jest
        .spyOn(serviceVersionsRepository, 'findAndCount')
        .mockResolvedValue([mockService.versions, 1]);

      const serviceSpy = jest.spyOn(service, 'findVersions');

      const response = await request(app.getHttpServer()).get(
        '/services/uuid-1/versions',
      );

      expect(serviceSpy).toHaveBeenCalledWith('uuid-1', { take: 50, skip: 0 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        meta: {
          total: 1,
          page: 1,
          page_size: 50,
          last_page: 1,
        },
        data: [
          {
            id: 'version-uuid-2',
            version: '1.0.1',
            description: 'Description 1',
            url: 'http://localhost/api/v1.0.1/',
          },
        ],
      });
    });

    it('should return an bad response with a bad limit', async () => {
      let response = await request(app.getHttpServer()).get(
        '/services/uuid-1/versions?limit=bad',
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'limit must not be greater than 100',
          'limit must not be less than 1',
          'limit must be an integer number',
        ],
        error: 'Bad Request',
      });

      response = await request(app.getHttpServer()).get(
        '/services/uuid-1/versions?limit=999',
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['limit must not be greater than 100'],
        error: 'Bad Request',
      });

      response = await request(app.getHttpServer()).get(
        '/services/uuid-1/versions?limit=-1',
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['limit must not be less than 1'],
        error: 'Bad Request',
      });
    });

    it('should return an bad response with a bad page', async () => {
      let response = await request(app.getHttpServer()).get(
        '/services/uuid-1/versions?page=bad',
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'page must not be less than 1',
          'page must be an integer number',
        ],
        error: 'Bad Request',
      });

      response = await request(app.getHttpServer()).get(
        '/services/uuid-1/versions?page=-1',
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['page must not be less than 1'],
        error: 'Bad Request',
      });
    });

    it('should return 404 on service versions if service not found', async () => {
      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get(
        '/services/non-existent-uuid/versions',
      );

      expect(response.status).toBe(404);
    });
  });
});
