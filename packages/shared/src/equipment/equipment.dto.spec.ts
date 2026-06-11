import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateEquipmentDto } from './equipment.dto';

describe('CreateEquipmentDto', () => {
  it('rejects an empty name and category', () => {
    const dto = plainToInstance(CreateEquipmentDto, { name: '', category: '' });

    const properties = validateSync(dto).map((error) => error.property);

    expect(properties).toEqual(expect.arrayContaining(['name', 'category']));
  });

  it('converts quantity input to a number', () => {
    const dto = plainToInstance(CreateEquipmentDto, {
      name: 'Thermometer',
      category: 'Diagnostic',
      quantity: '2',
    });

    expect(validateSync(dto)).toHaveLength(0);
    expect(dto.quantity).toBe(2);
  });
});

