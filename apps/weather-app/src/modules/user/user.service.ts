import {ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Model} from "mongoose";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {CityDto} from "../weather/dto/city.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UpdatePasswordDto} from "./dto/update-password.dto";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userModel.exists({ email: createUserDto.email });
    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<{ user: User; message?: string }> {
    let message = null;

    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
      if (existingUser && existingUser._id.toString() !== userId) {
        message = 'Email already exists and was not updated.';
        delete updateUserDto.email;
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateUserDto },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return { user: updatedUser, message };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    await user.save();
  }

  async getCities(userId: string): Promise<CityDto[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.cities;
  }

  async addCity(userId: string, cityDto: CityDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cityExists = user.cities.some(
      (city) =>
        city.name === cityDto.name &&
        city.country === cityDto.country &&
        city.state === cityDto.state &&
        city.lat === cityDto.lat &&
        city.lon === cityDto.lon
    );

    if (cityExists) {
      return user;
    }

    user.cities.push(cityDto);

    return user.save();
  }

  async removeCity(userId: string, cityId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.cities.pull({ _id: cityId });

    return user.save();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
