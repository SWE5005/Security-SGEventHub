import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from '../../components/Header';
import { selectUserName } from '../../state/auth/slice';
import { useLogoutMutation } from '../../services/auth.service';
import { navigate } from 'gatsby';

// Mock the gatsby navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

// Mock the auth service
jest.mock('../../services/auth.service', () => ({
  useLogoutMutation: jest.fn(),
}));

// Mock the auth slice
jest.mock('../../state/auth/slice', () => ({
  selectUserName: jest.fn(),
}));

describe('Header Component', () => {
  const mockLogout = jest.fn();
  const mockUseLogoutMutation = useLogoutMutation as jest.Mock;
  const mockSelectUserName = selectUserName as jest.Mock;

  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'USER' } }, action) => state,
    },
  });

  beforeEach(() => {
    mockUseLogoutMutation.mockReturnValue([
      mockLogout,
      { isSuccess: false, isLoading: false },
    ]);

    mockSelectUserName.mockReturnValue('Test User');
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        {ui}
      </Provider>
    );
  };

  it('renders header with title', () => {
    renderWithProvider(<Header />);
    
    expect(screen.getByText('SG EventHub')).toBeInTheDocument();
  });

  it('renders home button', () => {
    renderWithProvider(<Header />);
    
    const homeButton = screen.getByLabelText('go to home');
    expect(homeButton).toBeInTheDocument();
  });

  it('renders account menu button', () => {
    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    expect(accountButton).toBeInTheDocument();
  });

  it('navigates to home when home button is clicked', () => {
    renderWithProvider(<Header />);
    
    const homeButton = screen.getByLabelText('go to home');
    fireEvent.click(homeButton);
    
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('opens account menu when account button is clicked', () => {
    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('My account')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('closes account menu when clicking outside', () => {
    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    fireEvent.click(document.body);
    
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('handles logout', async () => {
    mockUseLogoutMutation.mockReturnValue([
      mockLogout,
      { isSuccess: true, isLoading: false },
    ]);

    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows loading state during logout', () => {
    mockUseLogoutMutation.mockReturnValue([
      mockLogout,
      { isSuccess: false, isLoading: true },
    ]);

    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);
    
    expect(logoutButton).toBeDisabled();
  });

  it('shows profile when username is not available', () => {
    mockSelectUserName.mockReturnValue(null);

    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('closes menu when clicking menu item', () => {
    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    const menuItem = screen.getByText('My account');
    fireEvent.click(menuItem);
    
    expect(screen.queryByText('My account')).not.toBeInTheDocument();
  });

  it('handles logout error', async () => {
    mockUseLogoutMutation.mockReturnValue([
      mockLogout,
      { isSuccess: false, isLoading: false, error: new Error('Logout failed') },
    ]);

    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it('handles menu item click with navigation', () => {
    renderWithProvider(<Header />);
    
    const accountButton = screen.getByLabelText('account of current user');
    fireEvent.click(accountButton);
    
    const menuItem = screen.getByText('My account');
    fireEvent.click(menuItem);
    
    expect(navigate).toHaveBeenCalledWith('/profile');
  });
}); 