import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserList from '../../components/UserList';
import { useGetUserListQuery, useDeleteUserMutation } from '../../services/user.service';

// Mock the gatsby navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

// Mock the user service
jest.mock('../../services/user.service', () => ({
  useGetUserListQuery: jest.fn(),
  useDeleteUserMutation: jest.fn(),
}));

describe('UserList Component', () => {
  const mockUsers = [
    {
      userId: '1',
      userName: 'Test User',
      activeStatus: 'Active',
      emailAddress: 'test@example.com',
      roles: 'ADMIN',
    },
  ];

  const mockGetUserListQuery = useGetUserListQuery as jest.Mock;
  const mockDeleteUserMutation = useDeleteUserMutation as jest.Mock;

  beforeEach(() => {
    mockGetUserListQuery.mockReturnValue({
      data: mockUsers,
      refetch: jest.fn(),
    });

    mockDeleteUserMutation.mockReturnValue([
      jest.fn(),
      { isSuccess: false },
    ]);
  });

  it('renders user list correctly', () => {
    render(<UserList />);
    
    expect(screen.getByText('UserName')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('handles edit button click', () => {
    render(<UserList />);
    
    const editButton = screen.getByLabelText('Edit User');
    fireEvent.click(editButton);
    
    expect(require('gatsby').navigate).toHaveBeenCalledWith('/users/edit?userId=1');
  });

  it('handles delete user', async () => {
    const deleteUser = jest.fn();
    mockDeleteUserMutation.mockReturnValue([
      deleteUser,
      { isSuccess: true },
    ]);

    render(<UserList />);
    
    const deleteButton = screen.getByText('Delete User?');
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith('1');
    });
  });

  it('refetches data after successful deletion', async () => {
    const refetch = jest.fn();
    mockGetUserListQuery.mockReturnValue({
      data: mockUsers,
      refetch,
    });

    mockDeleteUserMutation.mockReturnValue([
      jest.fn(),
      { isSuccess: true },
    ]);

    render(<UserList />);
    
    const deleteButton = screen.getByText('Delete User?');
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(refetch).toHaveBeenCalled();
    });
  });

  it('handles empty user list', () => {
    mockGetUserListQuery.mockReturnValue({
      data: [],
      refetch: jest.fn(),
    });

    render(<UserList />);
    
    expect(screen.getByText('UserName')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
}); 