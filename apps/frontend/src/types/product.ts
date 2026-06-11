export type ProductCategory =
  | 'WHEELCHAIR'
  | 'WALKER'
  | 'HOSPITAL_BED'
  | 'BLOOD_PRESSURE_MONITOR'
  | 'DIABETIC_SUPPLIES'
  | 'WOUND_CARE'
  | 'RESPIRATORY_EQUIPMENT';

export type ProductStockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: ProductCategory;
  description: string;
  stockStatus: ProductStockStatus;
  price: number;
  updatedAt: string;
  imageUrl: string;
}
