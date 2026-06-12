import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockProductApi } from '../api/mock-product-api';
import { ProductDetailPage } from './ProductDetailPage';

describe('ProductDetailPage', () => {
  it('แสดงรายละเอียดและช่องทางสอบถามสำหรับลูกค้า', async () => {
    render(
      <MemoryRouter initialEntries={['/products/product-004']}>
        <Routes>
          <Route path="/products/:productId" element={<ProductDetailPage api={new MockProductApi()} lineContactUrl="https://line.me/test" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'เครื่องวัดความดันอัตโนมัติ' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'สอบถามสินค้าทาง LINE' })).toHaveAttribute('href', 'https://line.me/test');
    expect(screen.getByText('จุดเด่นสินค้า')).toBeInTheDocument();
    expect(screen.getByText('ข้อมูลจำเพาะ')).toBeInTheDocument();
  });
});
