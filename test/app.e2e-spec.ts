import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseTestModule } from '../src/database/database.test.module';
import { DataSource } from 'typeorm';
import { HttpSuccessInterceptor } from '../src/interceptors/success.interceptor';
import { AllExceptionFilter } from '../src/interceptors/error.interceptor';

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
    app.useGlobalInterceptors(new HttpSuccessInterceptor());
    app.useGlobalFilters(new AllExceptionFilter(app.get(Logger)));
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/ (POST) City', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/cities')
      .send({
        cityName: 'jakarta',
        countryName: 'indonesia',
      });

    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.body.data).toEqual({
      countryName: 'indonesia',
      cityName: 'jakarta',
      id: 1,
    });
  });

  it('/ (POST) City -> should thrown an error 409 Conflict the city in this country already created', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/cities')
      .send({
        cityName: 'jakarta',
        countryName: 'indonesia',
      });

    expect(response.statusCode).toEqual(HttpStatus.CONFLICT);
    expect(response.body.errors).toEqual([
      { message: 'the city in this country already created' },
    ]);
  });

  it('/ (POST) City -> should thrown an error 400 Bad request cityName should not be empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/cities')
      .send({
        cityName: '',
        countryName: 'indonesia',
      });

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toEqual([
      { message: 'cityName should not be empty' },
    ]);
  });

  it('/ (POST) City -> should thrown an error 400 Bad request countryName must be a valid registered country', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/cities')
      .send({
        cityName: 'jakarta',
        countryName: 'unregistered country',
      });

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toEqual([
      { message: 'countryName must be a valid registered country' },
    ]);
  });

  it('/ (GET) City', async () => {
    const response = await request(app.getHttpServer()).get(
      '/event-management/cities/1',
    );

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body.data).toEqual({
      id: 1,
      cityName: 'jakarta',
      countryName: 'indonesia',
      events: [],
    });
  });

  it('/ (POST) Events', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: 'BTS Concert',
        price: 120,
        city: 'jakarta',
      });

    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.body.data).toEqual({
      name: 'bts concert',
      city: { id: 1, cityName: 'jakarta', countryName: 'indonesia' },
      price: 120,
      id: 1,
    });
  });

  it('/ (POST) Events -> should thrown an error', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: 'BTS Concert',
        price: 120,
        city: 'jakarta',
      });

    expect(response.statusCode).toEqual(HttpStatus.CONFLICT);
    expect(response.body.errors).toEqual([
      { message: 'BTS Concert already created' },
    ]);
  });

  it('/ (POST) Events -> should thrown an error 400 Bad request name should not be empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: '',
        price: 120,
        city: 'jakarta',
      });

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toEqual([
      { message: 'name should not be empty' },
    ]);
  });

  it("/ (POST) Events -> Should thrown 404 Not Found when city doesn't exist", async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: 'BTS Concert',
        price: 120,
        city: 'city is not exist',
      });

    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(response.body.errors).toEqual([{ message: 'City is not found' }]);
  });

  it('/ (POST) Events -> should thrown an error 400 Bad request price should not be empty and price should be number', async () => {
    const response = await request(app.getHttpServer())
      .post('/event-management/events')
      .send({
        name: 'Taylor Swift',
        price: '',
        city: 'jakarta',
      });

    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toEqual([
      { message: 'price should not be empty' },
      {
        message:
          'price must be a number conforming to the specified constraints',
      },
    ]);
  });

  it('/ (GET) Events', async () => {
    const response = await request(app.getHttpServer()).get(
      '/event-management/events',
    );
    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body.data).toEqual([
      {
        id: 1,
        name: 'bts concert',
        price: 120,
        city: { id: 1, cityName: 'jakarta', countryName: 'indonesia' },
      },
    ]);
  });

  it('/ (GET) Event', async () => {
    const response = await request(app.getHttpServer()).get(
      '/event-management/events/1',
    );

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body.data).toEqual({
      id: 1,
      name: 'bts concert',
      price: 120,
      city: { id: 1, cityName: 'jakarta', countryName: 'indonesia' },
    });
  });

  afterAll(async () => {
    DBSource.dropDatabase();
  });
});
