import { Product } from '../../types/product';
import {
  formatProductDate,
  formatThaiCurrency,
  productCategoryLabels,
  productStockLabels,
} from '../../lib/product';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onShare: (product: Product) => void;
}

const stockStyles: Record<Product['stockStatus'], string> = {
  IN_STOCK: 'bg-emerald-50 text-emerald-700',
  LOW_STOCK: 'bg-amber-50 text-amber-700',
  OUT_OF_STOCK: 'bg-rose-50 text-rose-700',
  PREORDER: 'bg-cyan-50 text-cyan-700',
};

export function ProductCard({ product, onView, onEdit, onShare }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1ede5]">
        <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${stockStyles[product.stockStatus]}`}>
          {productStockLabels[product.stockStatus]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div>
          <h2 className="font-heading text-lg font-bold leading-snug text-zinc-950">{product.name}</h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">SKU: {product.sku}</p>
          <p className="mt-2 text-sm text-zinc-500">{product.brand} · {productCategoryLabels[product.category]}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-700">{product.description}</p>
        </div>
        <div className="mt-auto pt-5">
          <p className="font-heading text-2xl font-bold text-zinc-950">{formatThaiCurrency(product.price)}</p>
          <p className="mt-1 text-xs text-zinc-500">อัปเดต {formatProductDate(product.updatedAt)}</p>
          <Button fullWidth className="mt-5" onClick={() => onView(product)}>ดูรายละเอียด</Button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="secondary" fullWidth onClick={() => onEdit(product)}>แก้ไขสินค้า</Button>
            <Button variant="ghost" fullWidth onClick={() => onShare(product)}>แชร์สินค้า</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
