import { useEffect, useMemo, useState } from 'react';
import { CategoryFilter, ProductCategoryFilter } from '../components/products/CategoryFilter';
import { ProductCard } from '../components/products/ProductCard';
import { ProductSkeleton } from '../components/products/ProductSkeleton';
import { SearchBar } from '../components/products/SearchBar';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { mockProducts } from '../data/mock-products';
import { productStockLabels } from '../lib/product';
import { Product, ProductStockStatus } from '../types/product';

type ProductSort = 'UPDATED_DESC' | 'NAME_ASC' | 'PRICE_ASC' | 'PRICE_DESC';
type StockFilter = ProductStockStatus | 'ALL';

interface ProductListPageProps {
  displayName: string;
}

const sortLabels: Record<ProductSort, string> = {
  UPDATED_DESC: 'อัปเดตล่าสุด',
  NAME_ASC: 'ชื่อสินค้า ก-ฮ',
  PRICE_ASC: 'ราคาต่ำไปสูง',
  PRICE_DESC: 'ราคาสูงไปต่ำ',
};

export function ProductListPage({ displayName }: ProductListPageProps) {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategoryFilter>('ALL');
  const [stock, setStock] = useState<StockFilter>('ALL');
  const [sort, setSort] = useState<ProductSort>('UPDATED_DESC');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const products = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('th-TH');
    return mockProducts
      .filter((product) => category === 'ALL' || product.category === category)
      .filter((product) => stock === 'ALL' || product.stockStatus === stock)
      .filter((product) => {
        if (!normalizedQuery) {
          return true;
        }
        return [product.name, product.sku, product.brand, product.description]
          .some((value) => value.toLocaleLowerCase('th-TH').includes(normalizedQuery));
      })
      .sort((left, right) => {
        switch (sort) {
          case 'NAME_ASC':
            return left.name.localeCompare(right.name, 'th-TH');
          case 'PRICE_ASC':
            return left.price - right.price;
          case 'PRICE_DESC':
            return right.price - left.price;
          default:
            return right.updatedAt.localeCompare(left.updatedAt);
        }
      });
  }, [category, query, sort, stock]);

  function clearFilters(): void {
    setQuery('');
    setCategory('ALL');
    setStock('ALL');
    setSort('UPDATED_DESC');
  }

  function viewProduct(product: Product): void {
    setNotice(`เปิดรายละเอียด ${product.name}`);
  }

  function editProduct(product: Product): void {
    setNotice(`เตรียมแก้ไข ${product.name}`);
  }

  async function shareProduct(product: Product): Promise<void> {
    const shareData = {
      title: product.name,
      text: `${product.name} (${product.sku})`,
      url: `${window.location.origin}/products?product=${product.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setNotice('คัดลอกลิงก์สินค้าแล้ว');
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      setNotice('ไม่สามารถแชร์สินค้าได้ กรุณาลองใหม่');
    }
  }

  return (
    <AppShell displayName={displayName}>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <header>
          <p className="text-sm font-semibold text-emerald-600">แคตตาล็อกสำหรับทีมขาย</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-zinc-950 sm:text-4xl">ผลิตภัณฑ์</h1>
          <p className="mt-2 max-w-2xl text-zinc-500">ค้นหาข้อมูลสินค้าได้รวดเร็วระหว่างเข้าพบลูกค้า</p>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <SearchBar value={query} onChange={setQuery} />
            <div className="grid grid-cols-2 gap-3 lg:flex">
              <Button variant="secondary" className="flex min-h-12 items-center justify-center gap-2" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                ตัวกรอง
              </Button>
              <Button variant="secondary" className="flex min-h-12 items-center justify-center gap-2" onClick={() => setSortOpen((current) => !current)} aria-expanded={sortOpen}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M8 7h12M8 12h8M8 17h4M4 5v14m0 0-2-2m2 2 2-2" /></svg>
                เรียงลำดับ
              </Button>
            </div>
          </div>
        </header>

        {filtersOpen && (
          <Card className="mt-4 p-5">
            <div className="flex items-center justify-between gap-4">
              <div><h2 className="font-heading font-bold text-zinc-950">ตัวกรองเพิ่มเติม</h2><p className="mt-1 text-sm text-zinc-500">เลือกสถานะสินค้าที่ต้องการแสดง</p></div>
              <Button variant="ghost" onClick={clearFilters}>ล้างตัวกรอง</Button>
            </div>
            <label className="mt-4 block text-sm font-medium text-zinc-700" htmlFor="stock-filter">
              สถานะสินค้า
              <select id="stock-filter" value={stock} onChange={(event) => setStock(event.target.value as StockFilter)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-base text-zinc-900 sm:max-w-sm">
                <option value="ALL">ทุกสถานะ</option>
                {Object.entries(productStockLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </Card>
        )}

        {sortOpen && (
          <Card className="mt-4 p-5">
            <h2 className="font-heading font-bold text-zinc-950">เรียงลำดับสินค้า</h2>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(sortLabels).map(([value, label]) => {
                const selected = sort === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => { setSort(value as ProductSort); setSortOpen(false); }}
                    className={`min-h-11 rounded-xl border px-4 py-2 text-left font-semibold ${selected ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-white text-zinc-700 hover:bg-stone-50'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        <section className="mt-6">
          <CategoryFilter value={category} onChange={setCategory} />
        </section>

        <section className="mt-6" aria-live="polite">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">{loading ? 'กำลังโหลดสินค้า...' : `พบ ${products.length} รายการ`}</p>
            {(query || category !== 'ALL' || stock !== 'ALL') && <Button variant="ghost" onClick={clearFilters}>ล้างตัวกรอง</Button>}
          </div>

          {notice && <div role="status" className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-700">{notice}</div>}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="กำลังโหลดรายการสินค้า">
              {Array.from({ length: 8 }, (_, index) => <ProductSkeleton key={index} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onView={viewProduct} onEdit={editProduct} onShare={(item) => void shareProduct(item)} />
              ))}
            </div>
          ) : (
            <Card className="px-6 py-14 text-center">
              <svg aria-hidden="true" viewBox="0 0 120 90" fill="none" className="mx-auto h-28 w-36 text-emerald-600">
                <rect x="24" y="14" width="72" height="62" rx="14" className="fill-stone-100 stroke-stone-300" strokeWidth="2" />
                <path d="M43 44h34M60 27v34" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <circle cx="91" cy="69" r="13" className="fill-white stroke-stone-300" strokeWidth="2" />
                <path d="m100 78 10 9" className="stroke-zinc-500" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <h2 className="mt-5 font-heading text-xl font-bold text-zinc-950">ไม่พบสินค้า</h2>
              <p className="mt-2 text-zinc-500">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
              <Button className="mt-6" onClick={clearFilters}>ล้างตัวกรอง</Button>
            </Card>
          )}
        </section>
      </main>
    </AppShell>
  );
}
