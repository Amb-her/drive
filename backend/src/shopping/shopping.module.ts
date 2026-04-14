import { Module } from '@nestjs/common';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';
import { DriveService } from './drive.service';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService, DriveService],
  exports: [ShoppingService],
})
export class ShoppingModule {}
