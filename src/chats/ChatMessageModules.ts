import { Module } from '@nestjs/common';
import { ChatsService } from './ChatMessageServices';
import { ChatsController } from './ChatMessageController';
import { ChatMessageEntity } from './ChatMessageEntity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageEntity])],
  providers: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
