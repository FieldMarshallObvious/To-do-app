import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from './contexts/UserContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createTheme, ThemeProvider } from '@mui/material/styles';

//* Connect Fonts
// Preconnect to Google Fonts
const linkPreconnectGoogleFonts = document.createElement('link');
linkPreconnectGoogleFonts.rel = 'preconnect';
linkPreconnectGoogleFonts.href = 'https://fonts.googleapis.com';
document.head.appendChild(linkPreconnectGoogleFonts);

const linkPreconnectGstatic = document.createElement('link');
linkPreconnectGstatic.rel = 'preconnect';
linkPreconnectGstatic.href = 'https://fonts.gstatic.com';
linkPreconnectGstatic.crossOrigin = '';
document.head.appendChild(linkPreconnectGstatic);

// Include Regular and Bold font 
const linkInterRegBoldFont = document.createElement('link');
linkInterRegBoldFont.rel = 'stylesheet';
linkInterRegBoldFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;800;900&display=swap';
document.head.appendChild(linkInterRegBoldFont);


const root = ReactDOM.createRoot(document.getElementById('root'));

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          
          
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          backgroundColor: '#FFFFF',
          borderColor: '#AAA399',
        },
      },
    },
  },
});


root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AuthProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
    </LocalizationProvider>
  </React.StrictMode>
);

reportWebVitals();
