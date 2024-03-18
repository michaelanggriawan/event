import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseTestModule } from '../src/database/database.test.module';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // DataSource to drop db after e2e is running.
  const DBSource = new DataSource({
    type: 'sqlite',
    database: 'db/test.sqlite',
    synchronize: true,
  });

  beforeAll(async () => {
    await DBSource.initialize();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(DatabaseTestModule)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) City', async () => {
    return request(app.getHttpServer())
      .post('/event-management/cities')
      .send({
        cityName: 'jakarta',
        countryName: 'indonesia',
      })
      .expect(HttpStatus.CREATED)
      .expect({ countryName: 'indonesia', cityName: 'jakarta', id: 1 });
  });

  it('/ (GET) City', async () => {
    return request(app.getHttpServer())
      .get('/event-management/cities/1')
      .expect(HttpStatus.OK)
      .expect({
        id: 1,
        cityName: 'jakarta',
        countryName: 'indonesia',
        events: [],
      });
  });

  it('/ (POST) Events', async () => {
    return request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: 'BTS Concert',
        price: 120,
        city: 'jakarta',
      })
      .expect(HttpStatus.CREATED)
      .expect({
        name: 'BTS Concert',
        city: { id: 1, cityName: 'jakarta', countryName: 'indonesia' },
        price: 120,
        id: 1,
      });
  });

  it("/ (POST) Events -> Should thrown 404 Not Found when city doesn't exist", async () => {
    return request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: 'BTS Concert',
        price: 120,
        city: 'city is not exist',
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/ (GET) Events', () => {
    return request(app.getHttpServer())
      .get('/event-management/events')
      .expect(HttpStatus.OK)
      .expect([{ id: 1, name: 'BTS Concert', price: 120 }]);
  });

  it('/ (GET) Event', async () => {
    return request(app.getHttpServer())
      .get('/event-management/events/1')
      .expect(HttpStatus.OK)
      .expect({ id: 1, name: 'BTS Concert', price: 120 });
  });

  afterAll(async () => {
    DBSource.dropDatabase();
  });
});
