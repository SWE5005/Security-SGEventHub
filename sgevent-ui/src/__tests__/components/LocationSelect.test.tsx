import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LocationSelect from '../../components/LocationSelect';
import { useSearchLocationMutation } from '../../services/map.service';

// Mock the map service
jest.mock('../../services/map.service', () => ({
  useSearchLocationMutation: jest.fn(),
}));

describe('LocationSelect Component', () => {
  const mockSearchLocation = jest.fn();
  const mockUseSearchLocationMutation = useSearchLocationMutation as jest.Mock;
  const defaultProps = {
    label: 'Location',
    value: '',
    onChange: jest.fn(),
    disabled: false,
  };

  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'USER' } }, action) => state,
    },
  });

  beforeEach(() => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isLoading: false, isSuccess: false, data: null },
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

  it('renders with label', () => {
    renderWithProvider(<LocationSelect {...defaultProps} />);
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
  });

  it('handles input change', async () => {
    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    
    await waitFor(() => {
      expect(mockSearchLocation).toHaveBeenCalledWith('Singapore');
    });
  });

  it('shows loading state', () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isLoading: true, isSuccess: false, data: null },
    ]);

    renderWithProvider(<LocationSelect {...defaultProps} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays location options when data is loaded', () => {
    const mockData = {
      results: [
        { ADDRESS: 'Singapore' },
        { ADDRESS: 'Singapore, Central' },
      ],
    };

    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isLoading: false, isSuccess: true, data: mockData },
    ]);

    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    
    expect(screen.getByText('Singapore')).toBeInTheDocument();
    expect(screen.getByText('Singapore, Central')).toBeInTheDocument();
  });

  it('handles option selection', () => {
    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    
    const option = screen.getByText('Singapore');
    fireEvent.click(option);
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    renderWithProvider(<LocationSelect {...defaultProps} disabled={true} />);
    
    const input = screen.getByLabelText('Location');
    expect(input).toBeDisabled();
  });

  it('debounces input changes', async () => {
    jest.useFakeTimers();
    
    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    
    expect(mockSearchLocation).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(500);
    
    await waitFor(() => {
      expect(mockSearchLocation).toHaveBeenCalledWith('Singapore');
    });
    
    jest.useRealTimers();
  });

  it('does not search when input is empty', () => {
    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockSearchLocation).not.toHaveBeenCalled();
  });

  it('does not search when input value is the same as current value', () => {
    renderWithProvider(<LocationSelect {...defaultProps} value="Singapore" />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    
    expect(mockSearchLocation).not.toHaveBeenCalled();
  });

  it('clears options when input is cleared', () => {
    const mockData = {
      results: [
        { ADDRESS: 'Singapore' },
        { ADDRESS: 'Singapore, Central' },
      ],
    };

    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isLoading: false, isSuccess: true, data: mockData },
    ]);

    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    fireEvent.change(input, { target: { value: '' } });
    
    expect(screen.queryByText('Singapore')).not.toBeInTheDocument();
    expect(screen.queryByText('Singapore, Central')).not.toBeInTheDocument();
  });

  it('does not update options when result is not successful', () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isLoading: false, isSuccess: false, data: null },
    ]);

    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    
    expect(screen.queryByText('Singapore')).not.toBeInTheDocument();
  });

  it('does not update options when result data is null', () => {
    mockUseSearchLocationMutation.mockReturnValue([
      mockSearchLocation,
      { isLoading: false, isSuccess: true, data: null },
    ]);

    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.change(input, { target: { value: 'Singapore' } });
    
    expect(screen.queryByText('Singapore')).not.toBeInTheDocument();
  });

  it('handles open and close events', () => {
    renderWithProvider(<LocationSelect {...defaultProps} />);
    
    const input = screen.getByLabelText('Location');
    fireEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    
    fireEvent.blur(input);
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
}); 