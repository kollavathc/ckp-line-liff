import {
  Product,
  ProductCategory,
  ProductCategoryItem,
  ProductListRequest,
  ProductStockStatus,
} from '@ckpharmacy/shared';

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  price: string | number;
  stockStatus: ProductStockStatus;
  imageUrl: string;
  highlights: string;
  specifications: string;
  featured: string | boolean;
  sortOrder: string | number;
  published: string | boolean;
  updatedAt: string;
}

interface ProductImageRow {
  productId: string;
  imageUrl: string;
  sortOrder: string | number;
}

const productHeaders: Array<keyof ProductRow> = [
  'id',
  'slug',
  'name',
  'sku',
  'brand',
  'category',
  'shortDescription',
  'description',
  'price',
  'stockStatus',
  'imageUrl',
  'highlights',
  'specifications',
  'featured',
  'sortOrder',
  'published',
  'updatedAt',
];

const imageHeaders: Array<keyof ProductImageRow> = ['productId', 'imageUrl', 'sortOrder'];
const categoryHeaders: Array<keyof ProductCategoryItem> = ['id', 'name', 'sortOrder'];

export interface ProductRepository {
  list(request: ProductListRequest): Product[];
  get(id: string): Product | null;
  listCategories(): ProductCategoryItem[];
}

export class SheetProductRepository implements ProductRepository {
  constructor(private readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  list(request: ProductListRequest): Product[] {
    const query = request.query?.trim().toLocaleLowerCase() ?? '';
    return this.products()
      .filter((product) => product.published)
      .filter((product) => !request.category || product.category === request.category)
      .filter((product) => !request.stockStatus || product.stockStatus === request.stockStatus)
      .filter((product) => !query || [product.name, product.brand, product.shortDescription]
        .some((value) => value.toLocaleLowerCase().includes(query)))
      .sort((left, right) => left.sortOrder - right.sortOrder || right.updatedAt.localeCompare(left.updatedAt));
  }

  get(id: string): Product | null {
    return this.products().find((product) => product.published && (product.id === id || product.slug === id)) ?? null;
  }

  listCategories(): ProductCategoryItem[] {
    return this.readRows<ProductCategoryItem>('categories', categoryHeaders)
      .map((category) => ({ ...category, sortOrder: Number(category.sortOrder) || 0 }))
      .sort((left, right) => left.sortOrder - right.sortOrder);
  }

  private products(): Product[] {
    const images = this.readRows<ProductImageRow>('product_images', imageHeaders)
      .sort((left, right) => Number(left.sortOrder) - Number(right.sortOrder));
    return this.readRows<ProductRow>('products', productHeaders).map((row) => ({
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      sku: String(row.sku),
      brand: String(row.brand),
      category: row.category,
      shortDescription: String(row.shortDescription),
      description: String(row.description),
      price: row.price === '' ? null : Number(row.price),
      stockStatus: row.stockStatus,
      imageUrl: String(row.imageUrl),
      imageUrls: images.filter((image) => image.productId === row.id).map((image) => String(image.imageUrl)),
      highlights: this.parseList(row.highlights),
      specifications: this.parseSpecifications(row.specifications),
      featured: this.toBoolean(row.featured),
      sortOrder: Number(row.sortOrder) || 0,
      published: this.toBoolean(row.published),
      updatedAt: String(row.updatedAt),
    }));
  }

  private parseList(value: string): string[] {
    return String(value).split('|').map((item) => item.trim()).filter(Boolean);
  }

  private parseSpecifications(value: string): Record<string, string> {
    return Object.fromEntries(this.parseList(value).map((item) => {
      const separator = item.indexOf(':');
      return separator < 0 ? [item, ''] : [item.slice(0, separator).trim(), item.slice(separator + 1).trim()];
    }));
  }

  private toBoolean(value: string | boolean): boolean {
    return value === true || String(value).toLowerCase() === 'true';
  }

  private readRows<T extends object>(sheetName: string, headers: Array<keyof T>): T[] {
    const sheet = this.spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`${sheetName} sheet is missing`);
    }
    const actualHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0]?.map(String);
    if (JSON.stringify(actualHeaders) !== JSON.stringify(headers)) {
      throw new Error(`${sheetName} sheet headers do not match the required schema`);
    }
    if (sheet.getLastRow() < 2) {
      return [];
    }
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues().map(
      (row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])) as T,
    );
  }
}
