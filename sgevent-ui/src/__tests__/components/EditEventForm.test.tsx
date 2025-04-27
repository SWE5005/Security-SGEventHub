import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EditEventForm from '../../components/EditEventForm';
import { navigate } from 'gatsby';

// Mock the gatsby navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

describe('EditEventForm Component', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    startDatetime: '2024-04-01T10:00:00Z',
    endDatetime: '2024-04-01T12:00:00Z',
    capacity: 10,
    location: 'Test Location',
    cover: 'test-image.jpg',
    userList: [],
  };

  const defaultProps = {
    value: mockEvent,
    type: 'edit',
    onSubmit: jest.fn(),
    onDelete: jest.fn(),
    isUpdating: false,
    isDeleting: false,
    isError: false,
  };

  it('renders form fields correctly', () => {
    render(<EditEventForm {...defaultProps} />);
    
    expect(screen.getByLabelText('Event Id')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Capacity')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
  });

  it('shows event ID field only in edit mode', () => {
    render(<EditEventForm {...defaultProps} type="edit" />);
    expect(screen.getByLabelText('Event Id')).toBeInTheDocument();

    render(<EditEventForm {...defaultProps} type="add" />);
    expect(screen.queryByLabelText('Event Id')).not.toBeInTheDocument();
  });

  it('shows member list only in view mode', () => {
    render(<EditEventForm {...defaultProps} type="view" />);
    expect(screen.getByText('Event Member List')).toBeInTheDocument();

    render(<EditEventForm {...defaultProps} type="edit" />);
    expect(screen.queryByText('Event Member List')).not.toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<EditEventForm {...defaultProps} />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(mockEvent);
  });

  it('shows loading state during submission', () => {
    render(<EditEventForm {...defaultProps} isUpdating={true} />);
    
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('shows error message when isError is true', () => {
    render(<EditEventForm {...defaultProps} isError={true} />);
    
    expect(screen.getByText('Something went wrong while adding/updating event, Please try again later.')).toBeInTheDocument();
  });

  it('navigates back to events page', () => {
    render(<EditEventForm {...defaultProps} />);
    
    const backButton = screen.getByText('Back to Event Home');
    fireEvent.click(backButton);
    
    expect(navigate).toHaveBeenCalledWith('/events');
  });

  it('updates form fields correctly', () => {
    render(<EditEventForm {...defaultProps} />);
    
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      ...mockEvent,
      title: 'New Title',
      description: 'New Description',
    });
  });

  it('disables form fields in view mode', () => {
    render(<EditEventForm {...defaultProps} type="view" />);
    
    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toBeDisabled();
    
    const descriptionInput = screen.getByLabelText('Description');
    expect(descriptionInput).toBeDisabled();
  });

  it('handles file upload', () => {
    render(<EditEventForm {...defaultProps} />);
    
    const fileInput = screen.getByLabelText('Event Cover');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
}); 