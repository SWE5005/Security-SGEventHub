import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../components/Layout';

describe('Layout Component', () => {
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
}); 