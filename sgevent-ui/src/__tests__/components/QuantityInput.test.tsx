import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantityInput from '../../components/QuantityInput';

describe('QuantityInput Component', () => {
  const defaultProps = {
    label: 'Quantity',
    min: 0,
    max: 10,
  };

  it('renders with default props', () => {
    render(<QuantityInput {...defaultProps} />);
    
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<QuantityInput {...defaultProps} defaultValue={5} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(5);
  });

  it('handles increment button click', () => {
    render(<QuantityInput {...defaultProps} defaultValue={5} />);
    
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(6);
  });

  it('handles decrement button click', () => {
    render(<QuantityInput {...defaultProps} defaultValue={5} />);
    
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButton);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(4);
  });

  it('respects min value', () => {
    render(<QuantityInput {...defaultProps} defaultValue={0} />);
    
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButton);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(0);
  });

  it('respects max value', () => {
    render(<QuantityInput {...defaultProps} defaultValue={10} />);
    
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(10);
  });

  it('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<QuantityInput {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders in disabled state', () => {
    render(<QuantityInput {...defaultProps} disabled />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
    
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    expect(incrementButton).toBeDisabled();
    
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    expect(decrementButton).toBeDisabled();
  });

  it('renders with required prop', () => {
    render(<QuantityInput {...defaultProps} required />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeRequired();
  });
}); 