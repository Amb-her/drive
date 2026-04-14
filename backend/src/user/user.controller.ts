import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Récupérer mon profil complet' })
  getMe(@CurrentUser('id') userId: string) {
    return this.userService.getMe(userId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer mon profil nutritionnel' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Post('profile')
  @ApiOperation({ summary: 'Créer/mettre à jour mon profil (onboarding)' })
  createProfile(@CurrentUser('id') userId: string, @Body() dto: CreateProfileDto) {
    return this.userService.createOrUpdateProfile(userId, dto);
  }
}
