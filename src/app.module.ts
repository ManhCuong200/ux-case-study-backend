import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsModule } from './modules/apps/apps.module';
import { ScreensModule } from './modules/screens/screens.module';
import { HotspotsModule } from './modules/hotspots/hotspots.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AiModule } from './providers/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để dùng được ở mọi nơi mà không cần import lại
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5433,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || '123456',
        database: configService.get<string>('DB_DATABASE') || 'ux_case_study',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Chỉ dùng khi dev
      }),
      inject: [ConfigService],
    }),
    AppsModule,
    ScreensModule,
    HotspotsModule,
    AuthModule,
    UsersModule,
    AiModule,
  ],
})
export class AppModule {}
