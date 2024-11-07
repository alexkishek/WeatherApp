import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CityDto } from '../weather/dto/city.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    updatePassword: jest.fn(),
    addCity: jest.fn(),
    getCities: jest.fn(),
    removeCity: jest.fn(),
  };

  const mockUser = {
    _id: 'userId',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Override guard to simplify testing
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };

      mockUserService.createUser.mockResolvedValue(mockUser);
      const result = await controller.createUser(createUserDto);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);
      const req = { user: { userId: 'userId' } };
      const result = await controller.getUser(req);
      expect(mockUserService.findById).toHaveBeenCalledWith('userId');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.findById.mockRejectedValue(new NotFoundException('User not found'));
      const req = { user: { userId: 'invalidId' } };
      await expect(controller.getUser(req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUserService.updateUser.mockResolvedValue(updatedUser);
      const req = { user: { userId: 'userId' } };
      const result = await controller.updateUser(req, updateUserDto);
      expect(mockUserService.updateUser).toHaveBeenCalledWith('userId', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('updatePassword', () => {
    it('should update the password for a user', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
      };

      mockUserService.updatePassword.mockResolvedValue(undefined);
      const req = { user: { userId: 'userId' } };
      await controller.updatePassword(req, updatePasswordDto);
      expect(mockUserService.updatePassword).toHaveBeenCalledWith('userId', updatePasswordDto);
    });
  });

  describe('addCity', () => {
    it('should add a city to the user\'s cities list', async () => {
      const cityDto: CityDto = {
        name: 'Detroit',
        state: 'Michigan',
        country: 'US',
        lat: 42.3314,
        lon: -83.0458,
      };

      mockUserService.addCity.mockResolvedValue(mockUser);
      const req = { user: { userId: 'userId' } };
      const result = await controller.addCity(req, cityDto);
      expect(mockUserService.addCity).toHaveBeenCalledWith('userId', cityDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getCities', () => {
    it('should return the list of cities for a user', async () => {
      const cities = [{ name: 'Detroit', state: 'Michigan', country: 'US', lat: 42.3314, lon: -83.0458 }];
      mockUserService.getCities.mockResolvedValue(cities);
      const req = { user: { userId: 'userId' } };
      const result = await controller.getCities(req);
      expect(mockUserService.getCities).toHaveBeenCalledWith('userId');
      expect(result).toEqual(cities);
    });
  });

  describe('removeCity', () => {
    it('should remove a city from the user\'s cities list', async () => {
      mockUserService.removeCity.mockResolvedValue(mockUser);
      const req = { user: { userId: 'userId' } };
      const cityId = 'cityId';
      const result = await controller.removeCity(req, cityId);
      expect(mockUserService.removeCity).toHaveBeenCalledWith('userId', cityId);
      expect(result).toEqual(mockUser);
    });
  });
});
