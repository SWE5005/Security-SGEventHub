import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import QuantityInput from '../../components/QuantityInput';

describe('QuantityInput Component', () => {
  const defaultProps = {
    label: 'Quantity',
    defaultValue: 1,
    onChange: jest.fn(),
    min: 1,
    max: 10,
    disabled: false,
  };

  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'USER' } }, action) => state,
    },
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        {ui}
      </Provider>
    );
  };

  it('renders with initial value', () => {
    renderWithProvider(<QuantityInput {...defaultProps} />);
    
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
  });

  it('handles increment', () => {
    renderWithProvider(<QuantityInput {...defaultProps} />);
    
    const incrementButton = screen.getByLabelText('Increment');
    fireEvent.click(incrementButton);
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('handles decrement', () => {
    renderWithProvider(<QuantityInput {...defaultProps} defaultValue={2} />);
    
    const decrementButton = screen.getByLabelText('Decrement');
    fireEvent.click(decrementButton);
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('does not increment beyond max value', () => {
    renderWithProvider(<QuantityInput {...defaultProps} defaultValue={10} />);
    
    const incrementButton = screen.getByLabelText('Increment');
    fireEvent.click(incrementButton);
    
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('does not decrement below min value', () => {
    renderWithProvider(<QuantityInput {...defaultProps} defaultValue={1} />);
    
    const decrementButton = screen.getByLabelText('Decrement');
    fireEvent.click(decrementButton);
    
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('handles direct input', () => {
    renderWithProvider(<QuantityInput {...defaultProps} />);
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('disables buttons when disabled', () => {
    renderWithProvider(<QuantityInput {...defaultProps} disabled={true} />);
    
    const incrementButton = screen.getByLabelText('Increment');
    const decrementButton = screen.getByLabelText('Decrement');
    
    expect(incrementButton).toBeDisabled();
    expect(decrementButton).toBeDisabled();
  });

  it('disables input when disabled', () => {
    renderWithProvider(<QuantityInput {...defaultProps} disabled={true} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
  });
}); 