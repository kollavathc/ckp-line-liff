import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProductApi } from '../api/mock-product-api';
import { ProductListPage } from './ProductListPage';

function renderPage(): void {
  render(
    <MemoryRouter initialEntries={['/products']}>
      <ProductListPage api={new MockProductApi()} />
    </MemoryRouter>,
  );
}

describe('ProductListPage', () => {
  it('แสดงสินค้าให้ลูกค้าหลังโหลดข้อมูล', async () => {
    renderPage();
    expect(screen.getByLabelText('กำลังโหลดรายการสินค้า')).toBeInTheDocument();
    expect(await screen.findByText('พบ 8 รายการ')).toBeInTheDocument();
    expect(screen.getByText('เครื่องวัดความดันอัตโนมัติ')).toBeInTheDocument();
    expect(screen.queryByText('แก้ไขสินค้า')).not.toBeInTheDocument();
  });

  it('ค้นหาสินค้าด้วยชื่อและยี่ห้อ', async () => {
    renderPage();
    await screen.findByText('พบ 8 รายการ');
    fireEvent.change(screen.getByRole('searchbox', { name: 'ค้นหาสินค้า' }), { target: { value: 'VitalCheck' } });
    expect(screen.getByText('พบ 1 รายการ')).toBeInTheDocument();
    expect(screen.getByText('เครื่องวัดความดันอัตโนมัติ')).toBeInTheDocument();
  });

  it('แสดง empty state เมื่อไม่พบสินค้า', async () => {
    renderPage();
    await screen.findByText('พบ 8 รายการ');
    fireEvent.change(screen.getByRole('searchbox', { name: 'ค้นหาสินค้า' }), { target: { value: 'ไม่มีสินค้านี้' } });
    await waitFor(() => expect(screen.getByText('ไม่พบสินค้า')).toBeInTheDocument());
  });
});
