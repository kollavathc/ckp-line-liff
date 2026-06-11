interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="relative block flex-1" htmlFor="product-search">
      <span className="sr-only">ค้นหาสินค้า</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400">
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </svg>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ค้นหาชื่อ รหัสสินค้า หรือยี่ห้อ"
        className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white py-3 pl-12 pr-4 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400"
      />
    </label>
  );
}
