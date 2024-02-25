import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

export class MongooseConfig implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      // uri: process.env['DATABASE_URL'],
      uri: 'mongodb://auth-mongo-srv:27017/auth',
    };
  }
}
