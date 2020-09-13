import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import SoundMeter from '..';

describe('SoundMeter component tests', () => {
  test('renders SoundMeter component', () => {
    const handleError = jest.fn();

    render(<SoundMeter handleError={handleError} />);
  });
});
