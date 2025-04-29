import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from 'antd'
import { theme } from 'antd'
const customTheme = {
  token: {
    colorPrimary: '#254D4D',
    colorInfo: '#E2783C',
    colorSuccess: '#566160',
    colorWarning: '#E4A163',
    colorError: '#BA8452',
    colorTextHeading: '#254D4D',
    colorText: '#566160',
    colorBgBase: '#F1EFE6',
  },
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={customTheme}>

      <App />
    </ConfigProvider>
  </StrictMode>,
)
