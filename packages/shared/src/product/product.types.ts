export type ProductCategory =
  | 'WHEELCHAIR'
  | 'WALKER'
  | 'HOSPITAL_BED'
  | 'BLOOD_PRESSURE_MONITOR'
  | 'DIABETIC_SUPPLIES'
  | 'WOUND_CARE'
  | 'RESPIRATORY_EQUIPMENT';

export type ProductStockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';

export interface ProductCategoryItem {
  id: ProductCategory;
  name: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  price: number | null;
  stockStatus: ProductStockStatus;
  imageUrl: string;
  imageUrls: string[];
  highlights: string[];
  specifications: Record<string, string>;
  featured: boolean;
  sortOrder: number;
  published: boolean;
  updatedAt: string;
}

export interface ProductListRequest {
  query?: string;
  category?: ProductCategory;
  stockStatus?: ProductStockStatus;
}

export interface ProductListResponse {
  items: Product[];
}

export interface ProductGetRequest {
  id: string;
}

export interface ProductCategoryListResponse {
  items: ProductCategoryItem[];
}
