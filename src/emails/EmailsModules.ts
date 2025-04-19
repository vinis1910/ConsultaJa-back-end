import { Module } from '@nestjs/common';
import { EmailsService } from './EmailsServices';
import { EmailsController } from './EmailsControllers';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [EmailsService],
  controllers: [EmailsController],
})
export class EmailsModule {}
