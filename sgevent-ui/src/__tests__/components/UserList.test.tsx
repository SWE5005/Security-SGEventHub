import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserList from '../../components/UserList';
import { useGetUserListQuery, useDeleteUserMutation } from '../../services/user.service';
import { navigate } from 'gatsby';

// Mock the user service
jest.mock('../../services/user.service', () => ({
  useGetUserListQuery: jest.fn(),
  useDeleteUserMutation: jest.fn(),
}));

// Mock gatsby navigate
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

describe('UserList Component', () => {
  const mockUsers = [
    {
      userId: 'user1',
      userName: 'John Doe',
      activeStatus: 'ACTIVE',
      emailAddress: 'john@example.com',
      roles: 'USER',
    },
    {
      userId: 'user2',
      userName: 'Jane Smith',
      activeStatus: 'INACTIVE',
      emailAddress: 'jane@example.com',
      roles: 'ADMIN',
    },
  ];

  const mockGetUserList = useGetUserListQuery as jest.Mock;
  const mockDeleteUser = useDeleteUserMutation as jest.Mock;
  const mockRefetch = jest.fn();

  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'ADMIN' } }, action) => state,
    },
  });

  beforeEach(() => {
    mockGetUserList.mockReturnValue({
      data: mockUsers,
      refetch: mockRefetch,
    });

    mockDeleteUser.mockReturnValue([
      jest.fn(),
      { isSuccess: false },
    ]);

    jest.clearAllMocks();
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        {ui}
      </Provider>
    );
  };

  it('renders user list table', () => {
    renderWithProvider(<UserList />);
    
    expect(screen.getByText('UserName')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays user data in table', () => {
    renderWithProvider(<UserList />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('handles edit button click', () => {
    renderWithProvider(<UserList />);
    
    const editButtons = screen.getAllByLabelText('Edit User');
    fireEvent.click(editButtons[0]);
    
    expect(navigate).toHaveBeenCalledWith('/users/edit?userId=user1');
  });

  it('handles delete user', async () => {
    const mockDelete = jest.fn();
    mockDeleteUser.mockReturnValue([
      mockDelete,
      { isSuccess: true },
    ]);

    renderWithProvider(<UserList />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion in modal
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(mockDelete).toHaveBeenCalledWith('user1');
  });

  it('refetches data after successful deletion', async () => {
    mockDeleteUser.mockReturnValue([
      jest.fn(),
      { isSuccess: true },
    ]);

    renderWithProvider(<UserList />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion in modal
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('handles empty user list', () => {
    mockGetUserList.mockReturnValue({
      data: [],
      refetch: mockRefetch,
    });

    renderWithProvider(<UserList />);
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('handles loading state', () => {
    mockGetUserList.mockReturnValue({
      data: null,
      refetch: mockRefetch,
    });

    renderWithProvider(<UserList />);
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('handles error state', () => {
    mockGetUserList.mockReturnValue({
      data: null,
      error: new Error('Failed to fetch users'),
      refetch: mockRefetch,
    });

    renderWithProvider(<UserList />);
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('handles delete error', async () => {
    const mockDelete = jest.fn().mockRejectedValue(new Error('Delete failed'));
    mockDeleteUser.mockReturnValue([
      mockDelete,
      { isSuccess: false, error: new Error('Delete failed') },
    ]);

    renderWithProvider(<UserList />);
    
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion in modal
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });
}); 