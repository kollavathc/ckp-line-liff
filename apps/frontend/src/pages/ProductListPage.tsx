import { useEffect, useMemo, useState } from 'react';
import { ProductApi } from '../api/product-api';
import { AppShell } from '../components/layout/AppShell';
import { CategoryFilter, ProductCategoryFilter } from '../components/products/CategoryFilter';
import { ProductCard } from '../components/products/ProductCard';
import { ProductSkeleton } from '../components/products/ProductSkeleton';
import { SearchBar } from '../components/products/SearchBar';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Product, ProductCategoryItem, ProductStockStatus } from '../types/product';

type ProductSort = 'FEATURED' | 'NAME_ASC' | 'PRICE_ASC' | 'PRICE_DESC';
type StockFilter = ProductStockStatus | 'ALL';

interface ProductListPageProps {
  api: ProductApi;
}

const sortLabels: Record<ProductSort, string> = {
  FEATURED: 'สินค้าแนะนำ',
  NAME_ASC: 'ชื่อสินค้า ก-ฮ',
  PRICE_ASC: 'ราคาต่ำไปสูง',
  PRICE_DESC: 'ราคาสูงไปต่ำ',
};

export function ProductListPage({ api }: ProductListPageProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategoryFilter>('ALL');
  const [stock, setStock] = useState<StockFilter>('ALL');
  const [sort, setSort] = useState<ProductSort>('FEATURED');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([api.list(), api.listCategories()])
      .then(([products, categoryItems]) => {
        if (active) {
          setItems(products);
          setCategories(categoryItems);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'ไม่สามารถโหลดสินค้าได้');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [api]);

  const products = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('th-TH');
    return items
      .filter((product) => category === 'ALL' || product.category === category)
      .filter((product) => stock === 'ALL' || product.stockStatus === stock)
      .filter((product) => !normalizedQuery || [product.name, product.brand, product.shortDescription]
        .some((value) => value.toLocaleLowerCase('th-TH').includes(normalizedQuery)))
      .sort((left, right) => {
        if (sort === 'NAME_ASC') return left.name.localeCompare(right.name, 'th-TH');
        if (sort === 'PRICE_ASC') return (left.price ?? Number.MAX_SAFE_INTEGER) - (right.price ?? Number.MAX_SAFE_INTEGER);
        if (sort === 'PRICE_DESC') return (right.price ?? -1) - (left.price ?? -1);
        return Number(right.featured) - Number(left.featured) || left.sortOrder - right.sortOrder;
      });
  }, [category, items, query, sort, stock]);

  function clearFilters(): void {
    setQuery('');
    setCategory('ALL');
    setStock('ALL');
    setSort('FEATURED');
  }

  return (
    <AppShell>
      <main>
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-sm font-semibold text-emerald-600">ดูแลสุขภาพที่บ้านอย่างมั่นใจ</p>
            <h1 className="mt-2 max-w-3xl font-heading text-3xl font-bold text-zinc-950 sm:text-5xl">อุปกรณ์การแพทย์ที่เลือกให้เหมาะกับทุกคนในครอบครัว</h1>
            <p className="mt-4 max-w-2xl leading-7 text-zinc-600">เลือกชมสินค้า เปรียบเทียบข้อมูล และสอบถามเภสัชกรก่อนตัดสินใจได้โดยตรงผ่าน LINE</p>
            <div className="mt-7 max-w-3xl"><SearchBar value={query} onChange={setQuery} /></div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && <Alert>{error}</Alert>}
          <section id="categories" className="scroll-mt-24">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div><h2 className="font-heading text-xl font-bold text-zinc-950">เลือกตามหมวดหมู่</h2><p className="mt-1 text-sm text-zinc-500">ค้นหาสินค้าที่ตรงกับการดูแลของคุณ</p></div>
              <Button variant="secondary" onClick={() => setFiltersOpen((current) => !current)}>ตัวกรอง</Button>
            </div>
            <CategoryFilter value={category} onChange={setCategory} categories={categories} />
          </section>

          {filtersOpen && (
            <Card className="mt-5 grid gap-4 p-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">สถานะสินค้า<select value={stock} onChange={(event) => setStock(event.target.value as StockFilter)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5"><option value="ALL">ทุกสถานะ</option><option value="IN_STOCK">พร้อมจำหน่าย</option><option value="LOW_STOCK">สินค้าใกล้หมด</option><option value="PREORDER">สั่งจองล่วงหน้า</option><option value="OUT_OF_STOCK">สินค้าหมด</option></select></label>
              <label className="text-sm font-medium text-zinc-700">เรียงลำดับ<select value={sort} onChange={(event) => setSort(event.target.value as ProductSort)} className="mt-2 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5">{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            </Card>
          )}

          <section className="mt-8" aria-live="polite">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-heading text-xl font-bold text-zinc-950">สินค้าทั้งหมด</h2><p className="text-sm text-zinc-500">{loading ? 'กำลังโหลดสินค้า...' : `พบ ${products.length} รายการ`}</p></div>
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="กำลังโหลดรายการสินค้า">{Array.from({ length: 8 }, (_, index) => <ProductSkeleton key={index} />)}</div>
            ) : products.length ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            ) : (
              <Card className="px-6 py-14 text-center"><h2 className="font-heading text-xl font-bold text-zinc-950">ไม่พบสินค้า</h2><p className="mt-2 text-zinc-500">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p><Button className="mt-6" onClick={clearFilters}>ล้างตัวกรอง</Button></Card>
            )}
          </section>

          <section id="contact" className="mt-12 scroll-mt-24 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-zinc-950">ไม่แน่ใจว่าควรเลือกแบบไหน?</h2>
            <p className="mt-2 max-w-2xl leading-7 text-zinc-700">ส่งชื่อสินค้าหรือความต้องการมาให้ทีมซีเค ฟาร์มาซีช่วยแนะนำได้ เราพร้อมให้ข้อมูลก่อนตัดสินใจ</p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
