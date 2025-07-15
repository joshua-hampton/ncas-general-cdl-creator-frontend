import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from '../../components/Header/Header.jsx';
import App from './App.jsx'
import { initDarkMode } from '../../components/DarkMode/DarkMode.jsx';

initDarkMode();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <App />
  </StrictMode>
)
