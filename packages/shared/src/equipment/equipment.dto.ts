import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { EquipmentCondition, EquipmentStatus } from './equipment.enums';

export class CreateEquipmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  itemCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  category = '';

  @IsOptional()
  @IsString()
  @MaxLength(80)
  brand = '';

  @IsOptional()
  @IsString()
  @MaxLength(80)
  model = '';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNumber = '';

  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100000)
  quantity = 1;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  unit = 'piece';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location = '';

  @IsEnum(EquipmentCondition)
  condition = EquipmentCondition.Good;

  @IsEnum(EquipmentStatus)
  status = EquipmentStatus.Available;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes = '';
}

export class UpdateEquipmentDto extends CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  id = '';
}

