import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppsScriptEquipmentApi } from '../api/apps-script-equipment-api';
import { EquipmentApi } from '../api/equipment-api';
import { Alert } from '../components/ui/Alert';
import { getEnvironment } from '../lib/env';
import { initializeLiff } from '../lib/liff';
import { EquipmentPage } from '../pages/EquipmentPage';

interface ReadyState {
  api: EquipmentApi;
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
        <Route path="/" element={<EquipmentPage api={ready.api} displayName={ready.displayName} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
