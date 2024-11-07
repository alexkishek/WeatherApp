import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CityDto } from '../weather/dto/city.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Data required to create a new user',
    examples: {
      example: {
        summary: 'Sample User',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user data',
    schema: {
      example: {
        _id: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cities: [],
      },
    },
  })
  async getUser(@Request() req): Promise<User> {
    const userId = req.user.userId;
    return await this.userService.findById(userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update the logged-in user' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Fields to update user information',
    examples: {
      example: {
        summary: 'Update User Data',
        value: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User data updated successfully',
    schema: {
      example: {
        _id: 'userId',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        cities: [],
      },
    },
  })
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<{ user: User; message?: string }> {
    const userId = req.user.userId;
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Put('update-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({
    type: UpdatePasswordDto,
    description: 'Current and new password data',
    examples: {
      example: {
        summary: 'Update Password',
        value: {
          currentPassword: 'oldPassword123',
          newPassword: 'newPassword123',
        },
      },
    },
  })
  @ApiResponse({ status: 204, description: 'Password updated successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid current password',
  })
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const userId = req.user.userId;
    await this.userService.updatePassword(userId, updatePasswordDto);
  }

  @Put('cities')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a city to user’s list of cities' })
  @ApiBody({
    type: CityDto,
    description: 'City data to add',
    examples: {
      example: {
        summary: 'City Data',
        value: {
          name: 'Detroit',
          state: 'Michigan',
          country: 'US',
          lat: 42.3314,
          lon: -83.0458,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'City added to user’s list',
    schema: {
      example: {
        _id: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cities: [{ name: 'Detroit', state: 'Michigan', country: 'US', lat: 42.3314, lon: -83.0458 }],
      },
    },
  })
  async addCity(@Request() req, @Body() cityDto: CityDto): Promise<User> {
    const userId = req.user.userId;
    return this.userService.addCity(userId, cityDto);
  }

  @Get('cities')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all cities for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of cities saved by the user',
    schema: {
      example: [
        { name: 'Detroit', state: 'Michigan', country: 'US', lat: 42.3314, lon: -83.0458 },
        { name: 'Dallas', state: 'Texas', country: 'US', lat: 32.7767, lon: -96.797 },
      ],
    },
  })
  async getCities(@Request() req): Promise<CityDto[]> {
    const userId = req.user.userId;
    return this.userService.getCities(userId);
  }

  @Delete('cities/:cityId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a city from user’s list' })
  @ApiParam({ name: 'cityId', description: 'ID of the city to remove' })
  @ApiResponse({
    status: 200,
    description: 'City successfully removed from user’s list',
    schema: {
      example: {
        _id: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cities: [],
      },
    },
  })
  async removeCity(@Request() req, @Param('cityId') cityId: string): Promise<User> {
    const userId = req.user.userId;
    return this.userService.removeCity(userId, cityId);
  }
}
