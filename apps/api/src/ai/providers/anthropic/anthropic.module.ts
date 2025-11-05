import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnthropicProvider } from './anthropic.provider';

@Module({
  imports: [ConfigModule],
  providers: [AnthropicProvider],
  exports: [AnthropicProvider],
})
export class AnthropicModule {}

