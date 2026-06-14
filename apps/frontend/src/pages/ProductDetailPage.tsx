import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductApi } from '../api/product-api';
import { AppShell } from '../components/layout/AppShell';
import { ProductCard } from '../components/products/ProductCard';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { canShareToLine, isInLiffChatContext, isInLiffClient, sendLineInquiry, shareToLine } from '../lib/liff';
import { formatProductPrice, productCategoryLabels, productStockLabels } from '../lib/product';
import { Product } from '../types/product';

interface ProductDetailPageProps {
  api: ProductApi;
  lineContactUrl: string;
}

const stockStyles: Record<Product['stockStatus'], string> = {
  IN_STOCK: 'bg-success-soft text-success-dark',
  LOW_STOCK: 'bg-highlight-soft text-zinc-800',
  OUT_OF_STOCK: 'bg-rose-50 text-rose-700',
  PREORDER: 'bg-secondary-soft text-secondary-dark',
};

export function ProductDetailPage({ api, lineContactUrl }: ProductDetailPageProps) {
  const { productId = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([api.get(productId), api.list()])
      .then(([item, items]) => {
        if (!active) return;
        setProduct(item);
        setSelectedImage(item.imageUrl);
        setRelatedProducts(items.filter((candidate) => candidate.id !== item.id && candidate.category === item.category).slice(0, 3));
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'ไม่สามารถโหลดข้อมูลสินค้าได้');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [api, productId]);

  const images = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set([product.imageUrl, ...product.imageUrls].filter(Boolean)));
  }, [product]);

  async function inquireProduct(): Promise<void> {
    if (!product) return;
    const text = `สอบถามสินค้า: ${product.name}\nราคา: ${formatProductPrice(product.price)}\nลิงก์: ${window.location.href}`;
    const inClient = isInLiffClient();
    const inChat = isInLiffChatContext();
    setNotice(`[debug] inClient=${String(inClient)} inChat=${String(inChat)}`);
    if (inClient && inChat) {
      try {
        await sendLineInquiry(text);
      } catch (err) {
        setNotice(`[debug] sendMessages error: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      window.open(lineContactUrl, '_blank');
    }
  }

  async function shareProduct(): Promise<void> {
    if (!product) return;
    const shareData = { title: product.name, text: `ดูข้อมูล ${product.name} จากซีเค ฟาร์มาซี`, url: window.location.href };
    try {
      if (canShareToLine()) {
        if (await shareToLine(`${shareData.text}\n${shareData.url}`)) setNotice('แชร์สินค้าไปยังแชต LINE แล้ว');
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setNotice('คัดลอกลิงก์สินค้าแล้ว');
      }
    } catch (shareError: unknown) {
      if (!(shareError instanceof Error && shareError.name === 'AbortError')) setNotice('ไม่สามารถแชร์สินค้าได้ กรุณาลองใหม่');
    }
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <Link to="/products" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-dark">กลับไปสินค้าทั้งหมด</Link>
        {loading ? (
          <div className="mt-5 grid animate-pulse gap-8 lg:grid-cols-2"><div className="aspect-square rounded-2xl bg-stone-200" /><div className="space-y-4"><div className="h-8 rounded bg-stone-200" /><div className="h-20 rounded bg-stone-200" /><div className="h-12 rounded bg-stone-200" /></div></div>
        ) : error || !product ? (
          <div className="mt-5"><Alert>{error || 'ไม่พบสินค้าที่ต้องการ'}</Alert></div>
        ) : (
          <>
            <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <section>
                <div className="aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-white"><img src={selectedImage} alt={product.name} className="h-full w-full object-contain" /></div>
                {images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3">{images.map((imageUrl) => <button key={imageUrl} type="button" onClick={() => setSelectedImage(imageUrl)} className={`aspect-square overflow-hidden rounded-xl border bg-white ${selectedImage === imageUrl ? 'border-primary' : 'border-stone-200'}`}><img src={imageUrl} alt="" className="h-full w-full object-contain" /></button>)}</div>}
              </section>

              <section>
                <p className="text-sm font-semibold text-primary">{productCategoryLabels[product.category]}</p>
                <h1 className="mt-2 font-heading text-3xl font-bold text-zinc-950 sm:text-4xl">{product.name}</h1>
                <p className="mt-2 text-zinc-500">{product.brand}</p>
                <span className={`mt-5 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${stockStyles[product.stockStatus]}`}>{productStockLabels[product.stockStatus]}</span>
                <p className="mt-6 font-heading text-3xl font-bold text-zinc-950">{formatProductPrice(product.price)}</p>
                <p className="mt-5 leading-7 text-zinc-700">{product.description}</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => void inquireProduct()} className="flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-white hover:bg-primary-dark">สอบถามสินค้าทาง LINE</button>
                  <button type="button" onClick={() => void shareProduct()} className="min-h-12 rounded-xl border border-stone-200 bg-white px-5 font-semibold text-zinc-700 hover:bg-stone-50">แชร์สินค้า</button>
                </div>
                <p className="mt-3 text-xs text-zinc-500">ราคาและสินค้าคงเหลืออาจมีการเปลี่ยนแปลง กรุณาสอบถามทางร้านก่อนสั่งซื้อ</p>
                {notice && <p role="status" className="mt-4 rounded-xl bg-secondary-soft p-3 text-sm text-secondary-dark">{notice}</p>}
              </section>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card className="p-6"><h2 className="font-heading text-xl font-bold text-zinc-950">จุดเด่นสินค้า</h2><ul className="mt-4 space-y-3">{product.highlights.map((highlight) => <li key={highlight} className="flex gap-3 text-zinc-700"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-success" />{highlight}</li>)}</ul></Card>
              <Card className="p-6"><h2 className="font-heading text-xl font-bold text-zinc-950">ข้อมูลจำเพาะ</h2><dl className="mt-4 divide-y divide-stone-200">{Object.entries(product.specifications).map(([label, value]) => <div key={label} className="grid grid-cols-2 gap-4 py-3"><dt className="text-zinc-500">{label}</dt><dd className="font-medium text-zinc-900">{value}</dd></div>)}</dl></Card>
            </div>

            {relatedProducts.length > 0 && <section className="mt-12"><h2 className="font-heading text-2xl font-bold text-zinc-950">สินค้าที่เกี่ยวข้อง</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
          </>
        )}
      </main>
    </AppShell>
  );
}
