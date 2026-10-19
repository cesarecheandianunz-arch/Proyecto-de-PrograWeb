import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import {InventarioProvider} from './context/InventarioContext.jsx';
import {PrestamosProvider} from './context/PrestamosContext.jsx';
import {StrictMode} from 'react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <InventarioProvider>
        <PrestamosProvider>
          <App />
        </PrestamosProvider>
      </InventarioProvider>
    </BrowserRouter>
  </StrictMode>
);
