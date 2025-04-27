import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Permission from '../../components/Permission';
import { renderWithStore, mockUser, mockAdmin } from '../utils/testUtils';

describe('Permission Component', () => {
  const defaultProps = {
    authKeyList: ['ADMIN', 'EVENT_MANAGER'],
    children: <div>Test Content</div>,
  };

  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'USER' } }, action) => state,
    },
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        {ui}
      </Provider>
    );
  };

  it('renders children when user has required role', () => {
    const store = configureStore({
      reducer: {
        auth: (state = { userInfo: { user_role: 'ADMIN' } }, action) => state,
      },
    });

    render(
      <Provider store={store}>
        <Permission {...defaultProps} />
      </Provider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('does not render children when user does not have required role', () => {
    renderWithProvider(<Permission {...defaultProps} />);
    
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('renders children when user has one of the required roles', () => {
    const store = configureStore({
      reducer: {
        auth: (state = { userInfo: { user_role: 'EVENT_MANAGER' } }, action) => state,
      },
    });

    render(
      <Provider store={store}>
        <Permission {...defaultProps} />
      </Provider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('does not render children when user has no matching role', () => {
    const store = configureStore({
      reducer: {
        auth: (state = { userInfo: { user_role: 'USER' } }, action) => state,
      },
    });

    render(
      <Provider store={store}>
        <Permission {...defaultProps} />
      </Provider>
    );
    
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  describe('Multiple Permissions', () => {
    it('handles multiple permissions', () => {
      renderWithStore(
        <Permission permission={['CREATE_EVENT', 'EDIT_EVENT']}>
          <div>Test Content</div>
        </Permission>,
        { user: mockAdmin }
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('handles empty permissions array', () => {
      renderWithStore(
        <Permission permission={[]}>
          <div>Test Content</div>
        </Permission>,
        { user: { ...mockUser, permissions: [] } }
      );
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null user', () => {
      renderWithStore(
        <Permission {...defaultProps} />,
        { user: null }
      );
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('handles undefined permissions', () => {
      renderWithStore(
        <Permission {...defaultProps} />,
        { user: { id: '1', username: 'testuser1', role: 'USER' } }
      );
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });
  });
}); 