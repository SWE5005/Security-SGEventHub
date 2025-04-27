import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ChipList from '../../components/ChipList';

describe('ChipList Component', () => {
  const mockItems = [
    { userId: '1', emailAddress: 'user1@example.com' },
    { userId: '2', emailAddress: 'user2@example.com' },
    { userId: '3', emailAddress: 'user3@example.com' },
  ];

  const defaultProps = {
    eventId: 'event1',
    items: mockItems,
    onDelete: jest.fn(),
    disabled: false,
    isDeleting: false,
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

  it('renders all chips correctly', () => {
    renderWithProvider(<ChipList {...defaultProps} />);
    
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    renderWithProvider(<ChipList {...defaultProps} items={[]} />);
    
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('user2@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('user3@example.com')).not.toBeInTheDocument();
  });

  it('handles delete action', () => {
    renderWithProvider(<ChipList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByTestId('CancelIcon');
    fireEvent.click(deleteButtons[0]);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith({
      userId: '1',
      eventId: 'event1',
    });
  });

  it('disables chips when disabled prop is true', () => {
    renderWithProvider(<ChipList {...defaultProps} disabled={true} />);
    
    const chips = screen.getAllByRole('button');
    chips.forEach(chip => {
      expect(chip).toHaveClass('Mui-disabled');
    });
  });

  it('disables chips when isDeleting prop is true', () => {
    renderWithProvider(<ChipList {...defaultProps} isDeleting={true} />);
    
    const chips = screen.getAllByRole('button');
    chips.forEach(chip => {
      expect(chip).toHaveClass('Mui-disabled');
    });
  });

  it('does not show delete buttons when onDelete is not provided', () => {
    renderWithProvider(<ChipList {...defaultProps} onDelete={undefined} />);
    
    const deleteButtons = screen.queryAllByTestId('CancelIcon');
    expect(deleteButtons).toHaveLength(0);
  });

  it('renders chips with correct color and variant', () => {
    renderWithProvider(<ChipList {...defaultProps} />);
    
    const chips = screen.getAllByRole('button');
    chips.forEach(chip => {
      expect(chip).toHaveClass('MuiChip-outlined');
      expect(chip).toHaveClass('MuiChip-colorPrimary');
    });
  });
}); 