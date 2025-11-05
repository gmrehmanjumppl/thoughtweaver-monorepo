import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SUPABASE_JWT_SECRET') || 'your-jwt-secret',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    SupabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

