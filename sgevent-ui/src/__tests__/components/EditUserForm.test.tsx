import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EditUserForm from '../../components/EditUserForm';
import { ROLE_OPTIONS, STATUS_OPTIONS } from '../../constants';

const defaultProps = {
  value: {
    userId: '1',
    emailAddress: 'test@example.com',
    userName: 'Test User',
    mobileNumber: '1234567890',
    activeStatus: 'ACTIVE',
    roles: 'END_USER'
  },
  onSubmit: jest.fn(),
  isUpdating: false,
  isError: false,
  isEdit: false
};

describe('EditUserForm Component', () => {
  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'ADMIN' } }, action) => state,
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

  it('renders form with initial values', () => {
    renderWithProvider(<EditUserForm {...defaultProps} />);
    
    expect(screen.getByLabelText('Email Address')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Name')).toHaveValue('Test User');
    expect(screen.getByLabelText('Mobile Number')).toHaveValue('1234567890');
    expect(screen.getByLabelText('Role')).toHaveValue('END_USER');
    expect(screen.getByLabelText('Status')).toHaveValue('ACTIVE');
  });

  it('handles input changes', () => {
    renderWithProvider(<EditUserForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    expect(nameInput).toHaveValue('Updated Name');
  });

  it('handles status selection', () => {
    renderWithProvider(<EditUserForm {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);
    
    const inactiveOption = screen.getByRole('option', { name: 'Inactive' });
    fireEvent.click(inactiveOption);
    
    expect(statusSelect).toHaveValue('INACTIVE');
  });

  it('handles role selection', () => {
    renderWithProvider(<EditUserForm {...defaultProps} />);
    
    const roleSelect = screen.getByLabelText('Role');
    fireEvent.mouseDown(roleSelect);
    
    const eventManagerOption = screen.getByRole('option', { name: 'Event Manager' });
    fireEvent.click(eventManagerOption);
    
    expect(roleSelect).toHaveValue('EVENT_MANAGER');
  });

  it('shows all status options', () => {
    renderWithProvider(<EditUserForm {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);
    
    STATUS_OPTIONS.forEach(option => {
      expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
    });
  });

  it('shows all role options', () => {
    renderWithProvider(<EditUserForm {...defaultProps} />);
    
    const roleSelect = screen.getByLabelText('Role');
    fireEvent.mouseDown(roleSelect);
    
    ROLE_OPTIONS.forEach(option => {
      expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
    });
  });

  it('handles form submission', () => {
    renderWithProvider(<EditUserForm {...defaultProps} />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(defaultProps.value);
  });

  it('shows loading state', () => {
    renderWithProvider(<EditUserForm {...defaultProps} isUpdating={true} />);
    
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('shows error message', () => {
    renderWithProvider(<EditUserForm {...defaultProps} isError={true} />);
    
    expect(screen.getByText('Something went wrong while adding/updating user, Please try again later.')).toBeInTheDocument();
  });

  it('shows user ID field in edit mode', () => {
    renderWithProvider(<EditUserForm {...defaultProps} isEdit={true} />);
    expect(screen.getByLabelText('User Id')).toBeInTheDocument();
  });

  it('disables email field in edit mode', () => {
    renderWithProvider(<EditUserForm {...defaultProps} isEdit={true} />);
    expect(screen.getByLabelText('Email Address')).toBeDisabled();
  });
}); 