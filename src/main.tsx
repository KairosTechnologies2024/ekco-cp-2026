import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom';
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
import RiskNotification from './components/RiskNotification';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <BreadcrumbsProvider>
            <BrowserRouter>
              <CustomersProvider>
                              {/* Global Toaster (renders via portal) - keep it at app root so all toasts are above everything */}
                              {createPortal(
                                <>
                                  <Toaster
                                    containerStyle={{ zIndex: 2147483647 }}
                                    toastOptions={{
                                      style: { zIndex: 2147483647 },
                                    }}
                                  />
                                  <RiskNotification />
                                </>,
                                document.body
                              )}
                <App />
              </CustomersProvider>
            </BrowserRouter>
          </BreadcrumbsProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
