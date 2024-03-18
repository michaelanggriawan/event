import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(new ValidationPipe());
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

  it('/ (POST) City -> should thrown an error 400 Bad request cityName should not be empty', async () => {
    return request(app.getHttpServer())
      .post('/event-management/cities')
      .send({
        cityName: '',
        countryName: 'indonesia',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: ['cityName should not be empty'],
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
  });

  it('/ (POST) City -> should thrown an error 400 Bad request countryName must be a valid registered country', async () => {
    return request(app.getHttpServer())
      .post('/event-management/cities')
      .send({
        cityName: 'jakarta',
        countryName: 'unregistered country',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: ['countryName must be a valid registered country'],
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
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

  it('/ (POST) Events -> should thrown an error 400 Bad request name should not be empty', async () => {
    return request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: '',
        price: 120,
        city: 'jakarta',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: ['name should not be empty'],
        error: 'Bad Request',
        statusCode: 400,
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

  it('/ (POST) Events -> should thrown an error 400 Bad request price should not be empty and price should be number', async () => {
    return request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: 'Taylor Swift',
        price: '',
        city: 'jakarta',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: [
          'price should not be empty',
          'price must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
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
