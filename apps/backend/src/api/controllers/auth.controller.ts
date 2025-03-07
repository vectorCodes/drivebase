import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Response,
} from '@nestjs/common';
import { LocalAuthGuard } from '@xilehq/backend/services/auth/local-auth.guard';
import { AuthService } from '@xilehq/backend/services/auth/auth.service';
import { CreateUserDto } from '@xilehq/internal/dtos/auth/create.user.dto';
import { UserInRequest } from '@xilehq/internal/types/auth.types';
import { User } from '@prisma/client';
import { Public } from '@xilehq/backend/services/auth/auth.guard';
import type { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this._authService.register(body);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: Request & { user: User },
    @Response() res: ExpressResponse
  ) {
    const { accessToken } = await this._authService.login(req.user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.end();
  }

  @Get('profile')
  async profile(@Request() req: Request & { user: UserInRequest }) {
    return req.user;
  }
}
