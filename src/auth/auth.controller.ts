import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: RegisterUserDto) {
    return this.userService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':ID')
  findByIdentification(@Param('ID') ID: string) {
    return this.userService.findOneByIdentification(ID);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('careers/:id')
  CareersById(@Param('id') identification: string) {
    return this.userService.findAllCareers(identification);
  }

  @UseGuards(JwtAuthGuard)
  @Post('careers/:careerId/:userId')
  addCareer(
    @Param('careerId', ParseMongoIdPipe) careerId: string,
    @Param('userId', ParseMongoIdPipe) userId: string,
  ) {
    return this.userService.addCareer(careerId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
