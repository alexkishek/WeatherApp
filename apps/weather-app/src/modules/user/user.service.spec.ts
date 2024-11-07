import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import {ConflictException, NotFoundException, UnauthorizedException} from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockUser = {
  _id: 'userId',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashedPassword',
  cities: {
    push: jest.fn(),
    pull: jest.fn(),
    some: jest.fn(),
  },
  save: jest.fn().mockResolvedValue(this),
};

mockUser.save.mockImplementation(async () => mockUser);

const mockUserModel = {
  findById: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(mockUser),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
  exists: jest.fn().mockResolvedValue(mockUser),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user with a hashed password', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      mockUserModel.exists.mockResolvedValue(false);

      mockUserModel.create.mockResolvedValue({
        ...mockUser,
        password: 'hashedPassword',
      });

      const result = await service.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(result).toEqual({ ...mockUser, password: 'hashedPassword' });
      expect(mockUserModel.exists).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password',
      };

      mockUserModel.exists.mockResolvedValue(true);

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserModel.exists).toHaveBeenCalledWith({ email: 'existing@example.com' });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updateUserDto = { firstName: 'Jane' };
      const updatedMockUser = {
        ...mockUser,
        ...updateUserDto,
      };
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedMockUser);

      const result = await service.updateUser('userId', updateUserDto);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId',
        { $set: updateUserDto },
        { new: true, runValidators: true },
      );
      expect(result.user.firstName).toEqual('Jane');
      expect(result.user).toEqual(updatedMockUser);
    });

    it('should return a message if updating to an email that already exists', async () => {
      const updateUserDto = { email: 'existing@example.com', firstName: 'Jane' };
      const existingUser = { ...mockUser, _id: 'otherUserId', email: 'existing@example.com' };
      const updatedMockUser = { ...mockUser, firstName: 'Jane' };

      mockUserModel.findOne.mockResolvedValueOnce(existingUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValueOnce(updatedMockUser);

      const result = await service.updateUser('userId', updateUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId',
        { $set: { firstName: 'Jane' } },
        { new: true, runValidators: true },
      );
      expect(result.message).toEqual('Email already exists and was not updated.');
      expect(result.user.email).not.toEqual('existing@example.com');
      expect(result.user.firstName).toEqual('Jane');
      expect(result.user).toEqual(updatedMockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValueOnce(null);
      await expect(service.updateUser('invalidId', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePassword', () => {
    it('should update the password for an existing user', async () => {
      const updatePasswordDto = {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      };
      await service.updatePassword('userId', updatePasswordDto);
      expect(bcrypt.compare).toHaveBeenCalledWith('currentPassword', mockUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const updatePasswordDto = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword',
      };
      await expect(service.updatePassword('userId', updatePasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getCities', () => {
    it('should return the list of cities for a user', async () => {
      const result = await service.getCities('userId');
      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(result).toEqual(mockUser.cities);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);
      await expect(service.getCities('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addCity', () => {
    it('should add a city to the user\'s list of cities', async () => {
      mockUser.cities.some.mockReturnValue(false);

      const cityDto = {
        name: 'Detroit',
        state: 'Michigan',
        country: 'US',
        lat: 42.3314,
        lon: -83.0458,
      };

      const result = await service.addCity('userId', cityDto);
      expect(mockUser.cities.push).toHaveBeenCalledWith(cityDto);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return user without adding city if city already exists', async () => {
      mockUser.cities.some.mockReturnValue(true);

      const cityDto = {
        name: 'Detroit',
        state: 'Michigan',
        country: 'US',
        lat: 42.3314,
        lon: -83.0458,
      };

      const result = await service.addCity('userId', cityDto);
      expect(mockUser.cities.push).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('removeCity', () => {
    it('should remove a city from the user\'s list of cities', async () => {
      const cityId = 'cityId';
      const result = await service.removeCity('userId', cityId);
      expect(mockUser.cities.pull).toHaveBeenCalledWith({ _id: cityId });
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);
      await expect(service.removeCity('invalidId', 'cityId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const result = await service.findById('userId');
      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);
      await expect(service.findById('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const result = await service.findOneByEmail('john.doe@example.com');
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
      await expect(service.findOneByEmail('invalid@example.com')).rejects.toThrow(NotFoundException);
    });
  });
});
