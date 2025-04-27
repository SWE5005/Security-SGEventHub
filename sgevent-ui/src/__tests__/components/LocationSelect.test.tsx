import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationSelect from '../../components/LocationSelect';
import { useSearchLocationMutation } from '../../services/map.service';

// Mock the map service
jest.mock('../../services/map.service', () => ({
  useSearchLocationMutation: jest.fn(),
}));

describe('LocationSelect Component', () => {
  const mockLocations = [
    { ADDRESS: 'Location 1' },
    { ADDRESS: 'Location 2' },
    { ADDRESS: 'Location 3' },
  ];

  const defaultProps = {
    label: 'Location',
    value: '',
    onChange: jest.fn(),
    disabled: false,
  };

  const mockSearchLocation = jest.fn();
  const mockUseSearchLocationMutation = useSearchLocationMutation as jest.Mock;

  beforeEach(() => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isSuccess: false, isLoading: false, data: null },
    ]);
  });

  it('renders with label', () => {
    render(<LocationSelect {...defaultProps} />);
    
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isSuccess: false, isLoading: true, data: null },
    ]);

    render(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles location search', async () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isSuccess: true, isLoading: false, data: { results: mockLocations } },
    ]);

    render(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(mockSearchLocation).toHaveBeenCalledWith('test');
    });
  });

  it('displays search results', async () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isSuccess: true, isLoading: false, data: { results: mockLocations } },
    ]);

    render(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('Location 1')).toBeInTheDocument();
      expect(screen.getByText('Location 2')).toBeInTheDocument();
      expect(screen.getByText('Location 3')).toBeInTheDocument();
    });
  });

  it('handles location selection', async () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isSuccess: true, isLoading: false, data: { results: mockLocations } },
    ]);

    render(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      const option = screen.getByText('Location 1');
      fireEvent.click(option);
    });
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    render(<LocationSelect {...defaultProps} disabled={true} />);
    
    const input = screen.getByLabelText('Location');
    expect(input).toBeDisabled();
  });

  it('debounces search input', async () => {
    jest.useFakeTimers();
    
    render(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockSearchLocation).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(500);
    
    await waitFor(() => {
      expect(mockSearchLocation).toHaveBeenCalledWith('test');
    });
    
    jest.useRealTimers();
  });

  it('handles empty search results', async () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isSuccess: true, isLoading: false, data: { results: [] } },
    ]);

    render(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Location 1')).not.toBeInTheDocument();
    });
  });

  it('handles search error', async () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isSuccess: false, isLoading: false, error: 'Search failed' },
    ]);

    render(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Location 1')).not.toBeInTheDocument();
    });
  });
}); 