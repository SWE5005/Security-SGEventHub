import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders button with correct text', () => {
    render(<Button onClick={mockOnClick}>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    render(<Button onClick={mockOnClick}>Test Button</Button>);
    fireEvent.click(screen.getByText('Test Button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    render(<Button onClick={mockOnClick} disabled>Test Button</Button>);
    const button = screen.getByText('Test Button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
}); 