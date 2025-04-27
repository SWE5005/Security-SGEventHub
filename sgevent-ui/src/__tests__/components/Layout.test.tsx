import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Layout from '../../components/Layout';

describe('Layout Component', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
    isLoading: false,
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

  it('renders header', () => {
    renderWithProvider(<Layout {...defaultProps} />);
    
    expect(screen.getByText('SG EventHub')).toBeInTheDocument();
  });

  it('renders children', () => {
    renderWithProvider(<Layout {...defaultProps} />);
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderWithProvider(<Layout {...defaultProps} />);
    
    expect(screen.getByText('© 2024 SG EventHub')).toBeInTheDocument();
  });

  it('renders children when not loading', () => {
    render(
      <Layout isLoading={false}>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders FormSkeleton when loading', () => {
    render(
      <Layout isLoading={true}>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    render(
      <Layout isLoading={false}>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders Container component', () => {
    render(
      <Layout isLoading={false}>
        <div>Test Content</div>
      </Layout>
    );
    
    const container = screen.getByRole('main');
    expect(container).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Layout isLoading={false}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Layout>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('renders empty children', () => {
    render(<Layout isLoading={false} />);
    
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithProvider(<Layout {...defaultProps} isLoading={true} />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 