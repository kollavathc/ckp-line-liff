import { Product } from '../../types/product';
import { Link } from 'react-router-dom';
import { formatProductPrice, productCategoryLabels, productStockLabels } from '../../lib/product';

interface ProductCardProps {
  product: Product;
}

const stockStyles: Record<Product['stockStatus'], string> = {
  IN_STOCK: 'bg-success-soft text-success-dark',
  LOW_STOCK: 'bg-highlight-soft text-zinc-800',
  OUT_OF_STOCK: 'bg-rose-50 text-rose-700',
  PREORDER: 'bg-secondary-soft text-secondary-dark',
};

export function ProductCard({ product }: ProductCardProps) {
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
          <p className="mt-2 text-sm text-zinc-500">{product.brand} · {productCategoryLabels[product.category]}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-700">{product.shortDescription}</p>
        </div>
        <div className="mt-auto pt-5">
          <p className="font-heading text-2xl font-bold text-zinc-950">{formatProductPrice(product.price)}</p>
          <Link to={`/products/${product.slug}`} className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary-dark">ดูรายละเอียด</Link>
        </div>
      </div>
    </article>
  );
}
