import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders all chips correctly', () => {
    render(<ChipList {...defaultProps} />);
    
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    render(<ChipList {...defaultProps} items={[]} />);
    
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('user2@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('user3@example.com')).not.toBeInTheDocument();
  });

  it('handles delete action', () => {
    render(<ChipList {...defaultProps} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith({
      userId: '1',
      eventId: 'event1',
    });
  });

  it('disables chips when disabled prop is true', () => {
    render(<ChipList {...defaultProps} disabled={true} />);
    
    const chips = screen.getAllByRole('button');
    chips.forEach(chip => {
      expect(chip).toBeDisabled();
    });
  });

  it('disables chips when isDeleting prop is true', () => {
    render(<ChipList {...defaultProps} isDeleting={true} />);
    
    const chips = screen.getAllByRole('button');
    chips.forEach(chip => {
      expect(chip).toBeDisabled();
    });
  });

  it('does not show delete buttons when onDelete is not provided', () => {
    render(<ChipList {...defaultProps} onDelete={undefined} />);
    
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(0);
  });

  it('handles null items', () => {
    render(<ChipList {...defaultProps} items={null} />);
    
    expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('user2@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('user3@example.com')).not.toBeInTheDocument();
  });

  it('renders chips with correct color and variant', () => {
    render(<ChipList {...defaultProps} />);
    
    const chips = screen.getAllByRole('button');
    chips.forEach(chip => {
      expect(chip).toHaveClass('MuiChip-outlined');
      expect(chip).toHaveClass('MuiChip-colorPrimary');
    });
  });
}); 