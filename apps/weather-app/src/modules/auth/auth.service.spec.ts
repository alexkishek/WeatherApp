import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUser = {
    _id: 'userId',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('testAccessToken');

      const result = await service.login(loginDto);

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwtService.signAsync).toHaveBeenCalledWith({ userId: 'userId', email: 'test@example.com' });
      expect(result).toEqual({ accessToken: 'testAccessToken' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = { email: 'nonexistent@example.com', password: 'password' };

      mockUserService.findOneByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'wrongPassword' };

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      (require('bcrypt').compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});
