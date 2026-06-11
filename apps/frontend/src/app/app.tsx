import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppsScriptEquipmentApi } from '../api/apps-script-equipment-api';
import { EquipmentApi } from '../api/equipment-api';
import { Alert } from '../components/ui/Alert';
import { getEnvironment } from '../lib/env';
import { initializeLiff } from '../lib/liff';
import { EquipmentPage } from '../pages/EquipmentPage';
import { ProductListPage } from '../pages/ProductListPage';

interface ReadyState {
  api: EquipmentApi | null;
  displayName: string;
}

export function App() {
  const [ready, setReady] = useState<ReadyState | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function start(): Promise<void> {
      try {
        const environment = getEnvironment();
        const session = await initializeLiff(environment.liffId);
        setReady({
          api: new AppsScriptEquipmentApi(environment.appsScriptUrl, session.idToken),
          displayName: session.displayName,
        });
      } catch (startError: unknown) {
        if (import.meta.env.DEV) {
          setReady({ api: null, displayName: 'โหมดตัวอย่าง' });
          return;
        }
        setError(startError instanceof Error ? startError.message : 'ไม่สามารถเปิดแอปพลิเคชันได้');
      }
    }
    void start();
  }, []);

  if (error) {
    return <main className="mx-auto min-h-screen max-w-xl bg-[#f8f5ef] p-6"><Alert>{error}</Alert></main>;
  }
  if (!ready) {
    return <main className="grid min-h-screen place-items-center bg-[#f8f5ef] text-zinc-500">กำลังเชื่อมต่อกับ LINE...</main>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage displayName={ready.displayName} />} />
        <Route
          path="/equipment"
          element={ready.api
            ? <EquipmentPage api={ready.api} displayName={ready.displayName} />
            : <main className="mx-auto min-h-screen max-w-xl bg-[#f8f5ef] p-6"><Alert>หน้านี้ต้องตั้งค่า LIFF ID และ URL ของบริการก่อนใช้งาน</Alert></main>}
        />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
