import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MicrophoneTest from '../';

describe('MicrophoneTest component tests', () => {
  test('should contain button with "Test micro" text', () => {
    render(<MicrophoneTest />);

    expect(screen.getByText('Test micro')).toBeInTheDocument();
  });

  test('should contain button with "No permission" after click without permission', () => {
    render(<MicrophoneTest />);

    fireEvent.click(screen.getByText('Test micro'));

    expect(screen.queryByText('Test micro')).toBeNull();

    expect(screen.getByText('No permission')).toBeInTheDocument();
  });
});
