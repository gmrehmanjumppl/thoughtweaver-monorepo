import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleProvider } from './google.provider';

@Module({
  imports: [ConfigModule],
  providers: [GoogleProvider],
  exports: [GoogleProvider],
})
export class GoogleModule {}

