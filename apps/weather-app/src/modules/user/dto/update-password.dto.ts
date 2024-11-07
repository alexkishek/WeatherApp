import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'currentPassword123',
    description: 'The current password of the user',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'newPassword456',
    description: 'The new password for the user, minimum length of 6 characters',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
