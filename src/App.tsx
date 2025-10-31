import { RouterProvider } from 'react-router';
import { ThemeModeScript, ThemeProvider } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { AuthProvider } from './hook/useAuth';
import { CookiesProvider } from 'react-cookie';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import CustomToaster from './components/CustomToaster';

function App() {
  return (
    <>
    {/* <Toaster
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
        /> */}

    {/* <Toaster
  position="bottom-center"
  toastOptions={{
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#4ADE80',  // Light green
        secondary: '#fff',
      },
      style: {
        background: '#059669',  // Light green background
        color: '#fff',
      },
    },
  }}
/> */}

 <CustomToaster />    {/* toast file with title and description*/ }


      <CookiesProvider>
        <React.StrictMode>
        <AuthProvider>
          <ThemeModeScript />
          <ThemeProvider theme={customTheme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthProvider>
        </React.StrictMode>
      </CookiesProvider>
    </>
  );
}

export default App;
