import { render, screen } from '@testing-library/react';
import { EquipmentApi } from '../../api/equipment-api';
import { EquipmentPage } from './equipment-page';

const api: jest.Mocked<EquipmentApi> = {
  list: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('EquipmentPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows an empty state after loading', async () => {
    api.list.mockResolvedValue([]);

    render(<EquipmentPage api={api} displayName="Nurse May" />);

    expect(await screen.findByText('No equipment recorded yet.')).toBeInTheDocument();
    expect(screen.getByText('Signed in as Nurse May')).toBeInTheDocument();
  });

  it('shows API errors', async () => {
    api.list.mockRejectedValue(new Error('Service unavailable'));

    render(<EquipmentPage api={api} displayName="Nurse May" />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Service unavailable');
  });
});

