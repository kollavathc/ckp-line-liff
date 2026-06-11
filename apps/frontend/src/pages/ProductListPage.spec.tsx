import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductListPage } from './ProductListPage';

function renderPage(): void {
  render(
    <MemoryRouter initialEntries={['/products']}>
      <ProductListPage displayName="คุณสมชาย" />
    </MemoryRouter>,
  );
}

describe('ProductListPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('แสดง skeleton ระหว่างโหลดและแสดงสินค้าเมื่อโหลดเสร็จ', async () => {
    renderPage();
    expect(screen.getByLabelText('กำลังโหลดรายการสินค้า')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(450));

    expect(screen.getByText('พบ 8 รายการ')).toBeInTheDocument();
    expect(screen.getByText('เครื่องวัดความดันอัตโนมัติ')).toBeInTheDocument();
  });

  it('ค้นหาสินค้าด้วยรหัส SKU', async () => {
    renderPage();
    await act(async () => jest.advanceTimersByTime(450));

    fireEvent.change(screen.getByRole('searchbox', { name: 'ค้นหาสินค้า' }), { target: { value: 'BP-AU-510' } });

    expect(screen.getByText('พบ 1 รายการ')).toBeInTheDocument();
    expect(screen.getByText('เครื่องวัดความดันอัตโนมัติ')).toBeInTheDocument();
  });

  it('แสดง empty state เมื่อไม่พบสินค้า', async () => {
    renderPage();
    await act(async () => jest.advanceTimersByTime(450));

    fireEvent.change(screen.getByRole('searchbox', { name: 'ค้นหาสินค้า' }), { target: { value: 'ไม่มีสินค้านี้' } });

    expect(screen.getByText('ไม่พบสินค้า')).toBeInTheDocument();
    expect(screen.getByText('ลองเปลี่ยนคำค้นหาหรือตัวกรอง')).toBeInTheDocument();
  });
});
