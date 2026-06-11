import { useEffect, useState } from 'react';
import { AppsScriptEquipmentApi } from '../api/apps-script-equipment-api';
import { EquipmentApi } from '../api/equipment-api';
import { EquipmentPage } from '../features/equipment/equipment-page';
import { getEnvironment } from '../lib/env';
import { initializeLiff } from '../lib/liff';

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
        setError(startError instanceof Error ? startError.message : 'Unable to start the application');
      }
    }
    void start();
  }, []);

  if (error) {
    return <main className="mx-auto max-w-xl p-6"><div role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div></main>;
  }
  if (!ready) {
    return <main className="grid min-h-screen place-items-center text-slate-500">Connecting to LINE...</main>;
  }
  return <EquipmentPage api={ready.api} displayName={ready.displayName} />;
}

