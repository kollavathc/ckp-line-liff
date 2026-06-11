import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EquipmentApi } from '../api/equipment-api';
import { EquipmentPage } from './EquipmentPage';

const api: jest.Mocked<EquipmentApi> = {
  list: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

function renderPage(): void {
  render(
    <MemoryRouter>
      <EquipmentPage api={api} displayName="พยาบาลเมย์" />
    </MemoryRouter>,
  );
}

describe('EquipmentPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('แสดงสถานะว่างหลังโหลดข้อมูล', async () => {
    api.list.mockResolvedValue([]);

    renderPage();

    expect(await screen.findByText('ยังไม่มีรายการอุปกรณ์')).toBeInTheDocument();
    expect(screen.getByText('พยาบาลเมย์')).toBeInTheDocument();
    expect(screen.getByText('อุปกรณ์ทั้งหมด')).toBeInTheDocument();
  });

  it('เปิดเมนูมือถือและแสดงชื่อผู้ใช้', async () => {
    api.list.mockResolvedValue([]);
    renderPage();
    await screen.findByText('ยังไม่มีรายการอุปกรณ์');

    fireEvent.click(screen.getByRole('button', { name: 'เปิดเมนู' }));

    expect(screen.getByText('เข้าสู่ระบบโดย พยาบาลเมย์')).toBeInTheDocument();
  });

  it('แสดงข้อผิดพลาดจาก API', async () => {
    api.list.mockRejectedValue(new Error('ไม่สามารถเชื่อมต่อบริการได้'));

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('ไม่สามารถเชื่อมต่อบริการได้');
  });
});
