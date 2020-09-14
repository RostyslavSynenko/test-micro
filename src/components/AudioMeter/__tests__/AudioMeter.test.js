import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import AudioMeter from '..';

describe('AudioMeter component tests', () => {
  test('renders AudioMeter component', () => {
    const handleError = jest.fn();

    render(
      <AudioMeter
        handleSuccess={handleSuccess}
        handleError={handleError}
        handlePermissionError={handlePermissionError}
      />
    );
  });
});
