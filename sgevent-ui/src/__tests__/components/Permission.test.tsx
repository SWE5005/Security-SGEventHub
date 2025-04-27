import React from 'react';
import { screen } from '@testing-library/react';
import Permission from '../../components/Permission';
import { renderWithStore, mockUser, mockAdmin } from '../utils/testUtils';

describe('Permission Component', () => {
  const defaultProps = {
    permission: 'CREATE_EVENT',
    children: <div>Test Content</div>
  };

  describe('Basic Functionality', () => {
    it('renders children when user has permission', () => {
      renderWithStore(
        <Permission {...defaultProps} />,
        { user: mockUser }
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('does not render children when user does not have permission', () => {
      renderWithStore(
        <Permission {...defaultProps} />,
        { user: { ...mockUser, permissions: [] } }
      );
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });
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