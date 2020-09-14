import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MicrophoneTestContainer from '..';

describe('MicrophoneTestContainer component tests', () => {
  const handleSuccess = jest.fn();
  const handleError = jest.fn();

  test('should contain header "Test microphone"', () => {
    render(
      <MicrophoneTestContainer
        handleSuccess={handleSuccess}
        handleError={handleError}
      />
    );

    expect(screen.getByText('Test microphone')).toBeInTheDocument();
  });

  test('should contain button with "Test" text', () => {
    render(
      <MicrophoneTestContainer
        handleSuccess={handleSuccess}
        handleError={handleError}
      />
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('should contain button with "No permission" after click without permission', () => {
    render(
      <MicrophoneTestContainer
        handleSuccess={handleSuccess}
        handleError={handleError}
      />
    );

    fireEvent.click(screen.getByText('Test'));

    expect(screen.queryByText('Test')).toBeNull();

    expect(screen.getByText('No permission')).toBeInTheDocument();
  });
});
