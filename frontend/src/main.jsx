import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from 'antd'
const customTheme = {
  token: {
    colorPrimary: '#2D9CDB', // A vibrant blue
    colorInfo: '#56CCF2', // Light, modern blue
    colorSuccess: '#27AE60', // Fresh green
    colorWarning: '#F2C94C', // Bright yellow
    colorError: '#EB5757', // Soft red for error
    colorTextHeading: '#333333', // Dark grey for headings (for contrast and readability)
    colorText: '#4F4F4F', // Light grey for general text
    colorBgBase: '#FFFFFF', // Clean white for background
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={customTheme}>

      <App />
    </ConfigProvider>
  </StrictMode>,
)
