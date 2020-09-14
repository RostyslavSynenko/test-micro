import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MicrophoneTest from '..';

describe('MicrophoneTest component tests', () => {
  const handlePermissionError = jest.fn();
  const handleSuccess = jest.fn();
  const handleError = jest.fn();

  test('should contain paragraph "Please say, I save lives"', () => {
    render(
      <MicrophoneTest
        handlePermissionError={handlePermissionError}
        handleSuccess={handleSuccess}
        handleError={handleError}
      />
    );

    expect(screen.getByText('Please say, "I save lives"')).toBeInTheDocument();
  });

  test('should contain 2 buttons', () => {
    render(
      <MicrophoneTest
        handlePermissionError={handlePermissionError}
        handleSuccess={handleSuccess}
        handleError={handleError}
      />
    );

    screen.debug();

    expect(screen.getByText("It didn't work")).toBeInTheDocument();
    expect(screen.getByText('It worked!')).toBeInTheDocument();
  });
});
