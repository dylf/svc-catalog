import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Functional endpoint tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  it ('/services (GET)', () => {
    return request(app.getHttpServer()).get('/services')
      .expect(200)
      .expect((res) => {
        expect(res.body.meta.total).toBe(50);
      })
  });


  it ('/services (GET) with pagination', () => {
    return request(app.getHttpServer()).get('/services?limit=5&page=2')
      .expect(200)
      .expect((res) => {
        expect(+res.body.meta.total).toBe(50);
        expect(+res.body.meta.page_size).toBe(5);
        expect(+res.body.meta.page).toBe(2);
        expect(res.body.data.length).toBe(5);
        expect(+res.body.meta.last_page).toBe(10);
      })
  });

  it ('/services (GET) with search', () => {
    return request(app.getHttpServer()).get('/services?search=atermthatcouldntpossiblybeseeded')
      .expect(200)
      .expect((res) => {
        expect(+res.body.meta.total).toBe(0);
        expect(+res.body.meta.page_size).toBe(50);
        expect(+res.body.meta.page).toBe(1);
        expect(res.body.data.length).toBe(0);
        expect(+res.body.meta.last_page).toBe(1);
      })
  });

  // Add more functional tests based on test plan.
});
