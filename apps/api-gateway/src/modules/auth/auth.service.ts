import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '@db/prisma';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userService.createUser({
        username,
        email,
        hashedPassword,
        lastSyncAt: Date.now().toString(),
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.userService.user({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.hashedPassword !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials provided!');
    }

    const payload = { sub: user.id, username: user.username };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '3h',
    });

    return {
      access_token: token,
      user,
    };
  }
}
