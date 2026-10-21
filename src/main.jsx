import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import {InventarioProvider} from './context/InventarioContext.jsx';
import {StrictMode} from 'react';
import { PrestamosProvider } from './context/PrestamosContext';
import { CuentaProvider } from './context/CuentaContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <InventarioProvider>
        <PrestamosProvider>
          <CuentaProvider>
            <App />
          </CuentaProvider>
        </PrestamosProvider>
      </InventarioProvider>
    </BrowserRouter>
  </StrictMode>
);
