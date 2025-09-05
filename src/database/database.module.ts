import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: process.env.DB_TYPE as any || 'sqlite', // 'mysql' | 'postgres' | 'oracle' | 'mariadb' | 'mongodb' | 'sqlite' ...
        database: process.env.DB_PATH,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        autoLoadEntities: true,
        synchronize: true, // only use in development, set to false in production
    }),
  ],
})

// MongoDB setup example:
// npm install @nestjs/mongoose mongoose
// import { MongooseModule } from '@nestjs/mongoose';
// @Module({
//   imports: [
//     MongooseModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         uri: config.get<string>('MONGO_URI'),
//       }),
//     }),
//   ],
// })


// PostgreSQL setup example:
// useFactory: (config: ConfigService) => ({
//   type: 'postgres',
//   host: config.get<string>('database.host'),
//   port: config.get<number>('database.port'),
//   username: config.get<string>('database.user'),
//   password: config.get<string>('database.pass'),
//   database: config.get<string>('database.name'),
//   autoLoadEntities: true,
//   synchronize: true,
// }),

// .env example for PostgreSQL and MongoDB:
// PORT=3000
// DATABASE_HOST=localhost
// DATABASE_PORT=5001
// DATABASE_USER=postgres
// DATABASE_PASS=123456
// DATABASE_NAME=nestjsdb
// MONGO_URI=mongodb://localhost:27017/nestjsdb // for MongoDB

// MySQL setup example:
// npm install mysql2
// useFactory: (config: ConfigService) => ({
//   type: 'mysql',
//   host: config.get<string>('DATABASE_HOST'),
//   port: config.get<number>('DATABASE_PORT'),
//   username: config.get<string>('DATABASE_USER'),
//   password: config.get<string>('DATABASE_PASS'),
//   database: config.get<string>('DATABASE_NAME'),
//   autoLoadEntities: true,
//   synchronize: true,
// }),
// .env example for MySQL:
// DATABASE_HOST=localhost
// DATABASE_PORT=3306
// DATABASE_USER=root
// DATABASE_PASS=123456
// DATABASE_NAME=nestjsdb

// OracleDB setup example:
// npm install oracledb
// useFactory: (config: ConfigService) => ({
//   type: 'oracle',
//   host: config.get<string>('DATABASE_HOST'),
//   port: config.get<number>('DATABASE_PORT'),
//   username: config.get<string>('DATABASE_USER'),
//   password: config.get<string>('DATABASE_PASS'),
//   sid: config.get<string>('DATABASE_SID'), // Oracle use SID instead of database
//   autoLoadEntities: true,
//   synchronize: true,
// }),
// .env example for OracleDB:
// DATABASE_HOST=localhost
// DATABASE_PORT=1521
// DATABASE_USER=system
// DATABASE_PASS=oraclepw
// DATABASE_SID=ORCLCDB

export class DatabaseModule {}

