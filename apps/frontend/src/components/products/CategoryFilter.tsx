import { ProductCategory } from '../../types/product';
import { productCategoryLabels } from '../../lib/product';

export type ProductCategoryFilter = ProductCategory | 'ALL';

interface CategoryFilterProps {
  value: ProductCategoryFilter;
  onChange: (value: ProductCategoryFilter) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const categories: ProductCategoryFilter[] = ['ALL', ...Object.keys(productCategoryLabels) as ProductCategory[]];

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" aria-label="กรองตามหมวดหมู่">
      <div className="flex w-max gap-2">
        {categories.map((category) => {
          const selected = category === value;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(category)}
              className={`min-h-11 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-200 bg-white text-zinc-700 hover:border-emerald-300 hover:text-emerald-700'}`}
            >
              {category === 'ALL' ? 'ทั้งหมด' : productCategoryLabels[category]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
