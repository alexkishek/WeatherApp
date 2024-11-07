import {Body, Controller, Post} from '@nestjs/common';
import {LoginDto} from "./dto/login.dto";
import {AuthService} from "./auth.service";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Logs in a user and returns an access token.' })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials: email and password.',
    examples: {
      example: {
        summary: 'Typical login request',
        description: 'A sample request body with email and password.',
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The access token for the logged-in user.',
    schema: {
      example: { accessToken: 'your-jwt-token' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}
