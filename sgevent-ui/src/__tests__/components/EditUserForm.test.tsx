import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EditUserForm from '../../components/EditUserForm';
import { navigate } from 'gatsby';
import { STATUS_OPTIONS, ROLE_OPTIONS } from '../../constants';

// Mock the gatsby navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

describe('EditUserForm Component', () => {
  const mockUser = {
    userId: '1',
    emailAddress: 'test@example.com',
    userName: 'Test User',
    mobileNumber: '1234567890',
    activeStatus: 'ACTIVE',
    roles: 'USER',
  };

  const defaultProps = {
    value: mockUser,
    onSubmit: jest.fn(),
    isUpdating: false,
    isError: false,
    isEdit: false,
  };

  it('renders form fields correctly', () => {
    render(<EditUserForm {...defaultProps} />);
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('shows user ID field only in edit mode', () => {
    render(<EditUserForm {...defaultProps} isEdit={true} />);
    expect(screen.getByLabelText('User Id')).toBeInTheDocument();

    render(<EditUserForm {...defaultProps} isEdit={false} />);
    expect(screen.queryByLabelText('User Id')).not.toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<EditUserForm {...defaultProps} />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(mockUser);
  });

  it('shows loading state during submission', () => {
    render(<EditUserForm {...defaultProps} isUpdating={true} />);
    
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('shows error message when isError is true', () => {
    render(<EditUserForm {...defaultProps} isError={true} />);
    
    expect(screen.getByText('Something went wrong while adding/updating user, Please try again later.')).toBeInTheDocument();
  });

  it('navigates back to users page', () => {
    render(<EditUserForm {...defaultProps} />);
    
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    
    expect(navigate).toHaveBeenCalledWith('/users');
  });

  it('updates form fields correctly', () => {
    render(<EditUserForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    
    const mobileInput = screen.getByLabelText('Mobile Number');
    fireEvent.change(mobileInput, { target: { value: '9876543210' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      ...mockUser,
      userName: 'New Name',
      mobileNumber: '9876543210',
    });
  });

  it('handles status selection', () => {
    render(<EditUserForm {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'INACTIVE' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      ...mockUser,
      activeStatus: 'INACTIVE',
    });
  });

  it('handles role selection', () => {
    render(<EditUserForm {...defaultProps} />);
    
    const roleSelect = screen.getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'ADMIN' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      ...mockUser,
      roles: 'ADMIN',
    });
  });

  it('disables email field in edit mode', () => {
    render(<EditUserForm {...defaultProps} isEdit={true} />);
    
    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toBeDisabled();
  });

  it('shows all status options', () => {
    render(<EditUserForm {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);
    
    STATUS_OPTIONS.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('shows all role options', () => {
    render(<EditUserForm {...defaultProps} />);
    
    const roleSelect = screen.getByLabelText('Role');
    fireEvent.mouseDown(roleSelect);
    
    ROLE_OPTIONS.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });
}); 