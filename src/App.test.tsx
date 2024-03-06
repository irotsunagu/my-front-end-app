import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * 単体テスト用のファイル。デフォルトのまま。
 * 今回は使用しません。
 */
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
