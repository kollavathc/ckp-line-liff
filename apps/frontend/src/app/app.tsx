import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppsScriptProductApi } from '../api/apps-script-product-api';
import { MockProductApi, UnavailableProductApi } from '../api/mock-product-api';
import { getEnvironment } from '../lib/env';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductListPage } from '../pages/ProductListPage';

export function App() {
  const environment = getEnvironment();
  const api = environment.appsScriptUrl
    ? new AppsScriptProductApi(environment.appsScriptUrl)
    : import.meta.env.DEV ? new MockProductApi() : new UnavailableProductApi();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage api={api} />} />
        <Route path="/products/:productId" element={<ProductDetailPage api={api} lineContactUrl={environment.lineContactUrl} />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
