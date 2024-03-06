import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * ルートコンポーネント（大元のファイル）
 * ここからAppコンポーネントを呼び出します。
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// 上部に書いてある通り、パフォーマンス測定したい場合はログ出力の実装を追加します。
// 今回は特段使いません。
reportWebVitals();
