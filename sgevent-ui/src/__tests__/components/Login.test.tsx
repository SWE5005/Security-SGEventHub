import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../../components/Login';
import { useLoginMutation } from '../../services/auth.service';
import { selectAuthSlice } from '../../state/auth/slice';
import { navigate } from 'gatsby';

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

  beforeEach(() => {
    mockUseLoginMutation.mockReturnValue([
      mockLogin,
      { isError: false, isLoading: false },
    ]);

    mockSelectAuthSlice.mockReturnValue({
      isLoggedIn: false,
    });
  });

  it('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome to Community Event Center')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
  });

  it('handles email input change', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('handles password input change', () => {
    render(<Login />);
    
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles login submission', () => {
    render(<Login />);
    
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

    render(<Login />);
    
    expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
  });

  it('navigates to home when logged in', () => {
    mockSelectAuthSlice.mockReturnValue({
      isLoggedIn: true,
    });

    render(<Login />);
    
    expect(navigate).toHaveBeenCalledWith('/home');
  });

  it('handles Google login', () => {
    render(<Login />);
    
    const googleButton = screen.getByText('Login with Google');
    fireEvent.click(googleButton);
    
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining('/oauth2/authorization/google'));
  });

  it('navigates to signup page', () => {
    render(<Login />);
    
    const signupLink = screen.getByText('Sign Up now');
    fireEvent.click(signupLink);
    
    expect(navigate).toHaveBeenCalledWith('/signup');
  });

  it('does not render when logged in', () => {
    mockSelectAuthSlice.mockReturnValue({
      isLoggedIn: true,
    });

    const { container } = render(<Login />);
    
    expect(container).toBeEmptyDOMElement();
  });

  it('requires email and password fields', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
}); 