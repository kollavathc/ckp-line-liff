import { ProductCategory, ProductStockStatus } from '../types/product';

export const productCategoryLabels: Record<ProductCategory, string> = {
  WHEELCHAIR: 'รถเข็นผู้ป่วย',
  WALKER: 'อุปกรณ์ช่วยเดิน',
  HOSPITAL_BED: 'เตียงผู้ป่วย',
  BLOOD_PRESSURE_MONITOR: 'เครื่องวัดความดัน',
  DIABETIC_SUPPLIES: 'อุปกรณ์เบาหวาน',
  WOUND_CARE: 'อุปกรณ์ดูแลแผล',
  RESPIRATORY_EQUIPMENT: 'อุปกรณ์ระบบทางเดินหายใจ',
};

export const productStockLabels: Record<ProductStockStatus, string> = {
  IN_STOCK: 'พร้อมจำหน่าย',
  LOW_STOCK: 'สินค้าใกล้หมด',
  OUT_OF_STOCK: 'สินค้าหมด',
  PREORDER: 'สั่งจองล่วงหน้า',
};

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatThaiCurrency(value: number): string {
  return `฿${currencyFormatter.format(value)}`;
}

export function formatProductPrice(value: number | null): string {
  return value === null ? 'สอบถามราคา' : formatThaiCurrency(value);
}

export function formatProductDate(value: string): string {
  return dateFormatter.format(new Date(value));
}
