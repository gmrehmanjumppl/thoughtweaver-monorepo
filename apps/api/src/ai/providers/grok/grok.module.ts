import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GrokProvider } from './grok.provider';

@Module({
  imports: [ConfigModule],
  providers: [GrokProvider],
  exports: [GrokProvider],
})
export class GrokModule {}

