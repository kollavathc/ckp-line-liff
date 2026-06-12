import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/app';
import { getEnvironment } from './lib/env';
import { initLiff } from './lib/liff';
import './index.css';

void initLiff(getEnvironment().liffId);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

