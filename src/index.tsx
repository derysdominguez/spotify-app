import React from 'react';
import App from './App';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store  from './app/store';

import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/css/main.css'

import "swiper/css/bundle";

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <App />
    </Provider>
);

