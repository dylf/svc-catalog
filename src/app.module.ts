import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './services/entities/service.entity';
import { ServiceVersion } from './services/entities/service-version.entity';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Service, ServiceVersion],
      synchronize: true, // Switch to false and use migrations in production.
    }),
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
