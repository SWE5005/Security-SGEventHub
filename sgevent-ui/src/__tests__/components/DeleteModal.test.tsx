import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DeleteModal from '../../components/DeleteModal';

describe('DeleteModal Component', () => {
  const mockOnDelete = jest.fn();
  const defaultProps = {
    title: 'Delete Confirmation',
    label: 'Are you sure you want to delete this item?',
    onDelete: mockOnDelete,
  };

  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'USER' } }, action) => state,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        {ui}
      </Provider>
    );
  };

  it('renders delete button', () => {
    renderWithProvider(<DeleteModal {...defaultProps} />);
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });

  it('opens modal when delete button is clicked', () => {
    renderWithProvider(<DeleteModal {...defaultProps} />);
    
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('closes modal when clicking outside', () => {
    renderWithProvider(<DeleteModal {...defaultProps} />);
    
    // Open modal
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    // Click outside (simulate clicking the backdrop)
    const modal = screen.getByRole('presentation');
    fireEvent.click(modal);
    
    expect(screen.queryByText('Delete Confirmation')).not.toBeInTheDocument();
  });

  it('calls onDelete when confirm button is clicked', () => {
    renderWithProvider(<DeleteModal {...defaultProps} />);
    
    // Open modal
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    // Click confirm
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Delete Confirmation')).not.toBeInTheDocument();
  });

  it('closes modal after successful deletion', () => {
    renderWithProvider(<DeleteModal {...defaultProps} />);
    
    // Open modal
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    // Click confirm
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(screen.queryByText('Delete Confirmation')).not.toBeInTheDocument();
  });

  it('renders with custom title and label', () => {
    const customProps = {
      title: 'Custom Title',
      label: 'Custom Label',
      onDelete: mockOnDelete,
    };
    
    renderWithProvider(<DeleteModal {...customProps} />);
    
    // Open modal
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('maintains modal state between renders', () => {
    const { rerender } = renderWithProvider(<DeleteModal {...defaultProps} />);
    
    // Open modal
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    // Rerender with same props
    rerender(
      <Provider store={mockStore}>
        <DeleteModal {...defaultProps} />
      </Provider>
    );
    
    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
  });
}); 