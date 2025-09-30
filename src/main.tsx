import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss';
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/theme/ThemeContext.tsx';
import { CustomersProvider } from './store/context/CustomersContext.tsx';
import { BreadcrumbsProvider } from './store/context/BreadcrumbsContext.tsx';
import { Provider } from 'react-redux';
import store, { persistor } from './store/redux/index.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <BreadcrumbsProvider>
            <BrowserRouter>
              <CustomersProvider>
                <Toaster/>
                <App />
              </CustomersProvider>
            </BrowserRouter>
          </BreadcrumbsProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
