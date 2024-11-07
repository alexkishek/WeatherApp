import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {UserService} from "../user/user.service";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string}> {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user._id.toString(), email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
