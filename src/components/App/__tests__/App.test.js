import React from 'react';
import { render } from '@testing-library/react';
import App from '../';

describe('App component tests', () => {
  test('renders App component', () => {
    render(<App />);
  });
});