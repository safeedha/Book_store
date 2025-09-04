
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import store from './app/store';
import ShopcontexProvider from './context/Shopcontex';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1051166021959-p32l9rst5jjtvssv4da4a04kjl1chu6d.apps.googleusercontent.com">
    <Provider store={store}>
      <ShopcontexProvider>
        <App />
      </ShopcontexProvider>
    </Provider>
  </GoogleOAuthProvider>
);
