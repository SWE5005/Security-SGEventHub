import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../../components/Login';
import { useLoginMutation } from '../../services/auth.service';
import { selectAuthSlice } from '../../state/auth/slice';
import { navigate } from 'gatsby';
import { renderWithStore } from '../utils/testUtils';

// Mock the gatsby navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

// Mock the auth service
jest.mock('../../services/auth.service', () => ({
  useLoginMutation: jest.fn(),
}));

// Mock the auth slice
jest.mock('../../state/auth/slice', () => ({
  selectAuthSlice: jest.fn(),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockUseLoginMutation = useLoginMutation as jest.Mock;
  const mockSelectAuthSlice = selectAuthSlice as jest.Mock;

  const initialAuthState = {
    isLoggedIn: false,
    user: null,
    error: null,
    loading: false
  };

  beforeEach(() => {
    mockUseLoginMutation.mockReturnValue([
      mockLogin,
      { isError: false, isLoading: false },
    ]);

    mockSelectAuthSlice.mockReturnValue(initialAuthState);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders login form with all elements', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    // Check for all required elements
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
    expect(screen.getByText('OR')).toBeInTheDocument();
    expect(screen.getByText('Sign Up now')).toBeInTheDocument();
  });

  it('handles email input change', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('handles password input change', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles login submission with valid credentials', async () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledWith({
      emailAddress: 'test@example.com',
      password: 'password123',
    });
  });

  it('shows error message on login failure', () => {
    mockUseLoginMutation.mockReturnValue([
      mockLogin,
      { isError: true, isLoading: false },
    ]);

    renderWithStore(<Login />, { auth: initialAuthState });
    
    expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
  });

  it('shows loading state during login', () => {
    mockUseLoginMutation.mockReturnValue([
      mockLogin,
      { isError: false, isLoading: true },
    ]);

    renderWithStore(<Login />, { auth: initialAuthState });
    
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeDisabled();
  });

  it('navigates to home when logged in', () => {
    const loggedInState = {
      ...initialAuthState,
      isLoggedIn: true
    };

    mockSelectAuthSlice.mockReturnValue(loggedInState);

    renderWithStore(<Login />, { auth: loggedInState });
    
    expect(navigate).toHaveBeenCalledWith('/home');
  });

  it('handles Google login', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const googleButton = screen.getByText('Login with Google');
    fireEvent.click(googleButton);
    
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining('/oauth2/authorization/google'));
  });

  it('navigates to signup page', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const signupLink = screen.getByText('Sign Up now');
    fireEvent.click(signupLink);
    
    expect(navigate).toHaveBeenCalledWith('/signup');
  });

  it('does not render when logged in', () => {
    const loggedInState = {
      ...initialAuthState,
      isLoggedIn: true
    };

    mockSelectAuthSlice.mockReturnValue(loggedInState);

    const { container } = renderWithStore(<Login />, { auth: loggedInState });
    
    expect(container).toBeEmptyDOMElement();
  });

  it('requires email and password fields', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('handles empty form submission', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledWith({
      emailAddress: '',
      password: '',
    });
  });

  it('handles special characters in email and password', () => {
    renderWithStore(<Login />, { auth: initialAuthState });
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test+special@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password!@#$%^&*()' } });
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledWith({
      emailAddress: 'test+special@example.com',
      password: 'password!@#$%^&*()',
    });
  });
}); 