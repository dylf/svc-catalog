import { Repository, DataSourceOptions, DataSource } from 'typeorm';
import { Service } from '../src/services/entities/service.entity';
import { ServiceVersion } from '../src/services/entities/service-version.entity';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Service, ServiceVersion],
  synchronize: true, // Switch to false and use migrations in production.
};

async function seed() {
  const dataSource = new DataSource(options);
  await dataSource.initialize();
  const serviceRepository: Repository<Service> =
    dataSource.getRepository(Service);
  const serviceVersionRepository: Repository<ServiceVersion> =
    dataSource.getRepository(ServiceVersion);

  if ((await serviceVersionRepository.find()).length > 0) {
    console.log('Database already seeded');
    return;
  }

  try {
    for (let i = 0; i < 50; i++) {
      // Generate between 1 and 20 versions per service
      const numVersions = faker.number.int({ min: 1, max: 20 });

      const url = `${faker.internet.url({ protocol: 'https', appendSlash: true })}api`;
      const service = serviceRepository.create({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        url: url,
        versions: Array.from({ length: numVersions }, () => {
          const version = faker.system.semver();
          return serviceVersionRepository.create({
            version,
            description: faker.lorem.sentence(),
            url: `${url}/${version}/`,
          });
        }),
      });
      await serviceRepository.save(service);
      console.log(`Service ${service.name} created.`);
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
