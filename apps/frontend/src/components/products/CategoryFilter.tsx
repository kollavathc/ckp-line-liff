import { ProductCategory, ProductCategoryItem } from '../../types/product';

export type ProductCategoryFilter = ProductCategory | 'ALL';

interface CategoryFilterProps {
  value: ProductCategoryFilter;
  onChange: (value: ProductCategoryFilter) => void;
  categories: ProductCategoryItem[];
}

export function CategoryFilter({ value, onChange, categories }: CategoryFilterProps) {
  const options: Array<{ id: ProductCategoryFilter; name: string }> = [
    { id: 'ALL', name: 'ทั้งหมด' },
    ...categories,
  ];

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" aria-label="กรองตามหมวดหมู่">
      <div className="flex w-max gap-2">
        {options.map((category) => {
          const selected = category.id === value;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(category.id)}
              className={`min-h-11 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-200 bg-white text-zinc-700 hover:border-emerald-300 hover:text-emerald-700'}`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
