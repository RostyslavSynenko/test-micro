import React from 'react';
import { render } from '@testing-library/react';
import AudioVisualizator from '../';

describe('AudioVisualizator component tests', () => {
  test('renders AudioVisualizator component', () => {
    const handleError = () => {};

    render(<AudioVisualizator handleError={handleError} />);
  });
});
