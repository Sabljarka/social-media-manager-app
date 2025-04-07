import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('Rendering App component...');

root.render(
  <Provider store={store}>
    <App />
  </Provider>
); 