import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
} from 'class-validator';
import { UserRoleEntity } from 'src/modules/user/submodules/user-role/entities/user-role.entity';

export class CreateUserRoleDto implements Pick<UserRoleEntity, 'name' | 'permissions'> {
  @ApiProperty({
    description: 'Name of the user role',
    examples: ['Default', 'Volunteer', 'Administrator'],
    default: 'Administrator',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: UserRoles;

  @ApiProperty({
    description: 'The total value of user role permissions',
    examples: [255, 15, 127, 31],
    default: 255,
  })
  @Max(2 ** 64 - 1)
  @Type(() => BigInt)
  @IsNumber()
  @IsDefined()
  permissions: bigint;
}
