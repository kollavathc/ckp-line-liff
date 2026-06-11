export function ProductSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-stone-100" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-4/5 animate-pulse rounded bg-stone-100" />
        <div className="h-4 w-2/5 animate-pulse rounded bg-stone-100" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-stone-100" />
        </div>
        <div className="h-7 w-1/3 animate-pulse rounded bg-stone-100" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-stone-100" />
      </div>
    </div>
  );
}
