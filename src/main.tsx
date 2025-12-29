import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './css/globals.css'
import App from './App.tsx'
import Spinner from './views/spinner/Spinner.tsx'
import { HelmetProvider } from 'react-helmet-async';
import "simplebar-react/dist/simplebar.min.css";



createRoot(document.getElementById('root')!).render(
    
<Suspense fallback={<Spinner />}>
<HelmetProvider>
        <App />
        </HelmetProvider>
    </Suspense>
    ,
)
