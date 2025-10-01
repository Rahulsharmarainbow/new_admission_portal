import { RouterProvider } from 'react-router';
import { ThemeModeScript, ThemeProvider } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { AuthProvider } from './hook/useAuth';
import { CookiesProvider } from 'react-cookie';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      <CookiesProvider>
        <AuthProvider>
          <ThemeModeScript />
          <ThemeProvider theme={customTheme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthProvider>
      </CookiesProvider>
    </>
  );
}

export default App;
