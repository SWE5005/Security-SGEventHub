import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EventReview from '../../components/EventReview';
import { useGetEventReviewsQuery, usePostEventReviewMutation } from '../../services/review.service';

// Mock the review service
jest.mock('../../services/review.service', () => ({
  useGetEventReviewsQuery: jest.fn(),
  usePostEventReviewMutation: jest.fn(),
}));

describe('EventReview Component', () => {
  const mockGetReviews = useGetEventReviewsQuery as jest.Mock;
  const mockPostReview = usePostEventReviewMutation as jest.Mock;
  const mockRefetch = jest.fn();

  const mockReviews = [
    { userId: 'user1', rating: 4, comment: 'Great event!' },
    { userId: 'user2', rating: 5, comment: 'Amazing experience!' },
  ];

  const defaultProps = {
    eventId: '1',
    onClose: jest.fn(),
    open: true,
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

  beforeEach(() => {
    mockGetReviews.mockReturnValue({
      data: mockReviews,
      isLoading: false,
      refetch: mockRefetch,
    });

    mockPostReview.mockReturnValue([
      jest.fn().mockResolvedValue({ data: true }),
      { isLoading: false },
    ]);

    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockGetReviews.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: mockRefetch,
    });

    render(<EventReview eventId="event1" userId="user1" />);
    expect(screen.getByText('Loading reviews...')).toBeInTheDocument();
  });

  it('renders reviews when available', () => {
    render(<EventReview eventId="event1" userId="user1" />);
    
    expect(screen.getByText('Event Reviews')).toBeInTheDocument();
    expect(screen.getByText('Great event!')).toBeInTheDocument();
    expect(screen.getByText('Amazing experience!')).toBeInTheDocument();
  });

  it('renders no reviews message when empty', () => {
    mockGetReviews.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: mockRefetch,
    });

    render(<EventReview eventId="event1" userId="user1" />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  it('allows user to submit a review when they have not reviewed', async () => {
    render(<EventReview eventId="event1" userId="user3" />);
    
    const ratingInput = screen.getByLabelText('Rating');
    const commentInput = screen.getByLabelText('Comment');
    const submitButton = screen.getByText('Submit Review');

    fireEvent.change(ratingInput, { target: { value: 4 } });
    fireEvent.change(commentInput, { target: { value: 'Test review' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Review submitted successfully.')).toBeInTheDocument();
    });
  });

  it('shows error message on review submission failure', async () => {
    mockPostReview.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Failed to submit')),
      { isLoading: false },
    ]);

    render(<EventReview eventId="event1" userId="user3" />);
    
    const ratingInput = screen.getByLabelText('Rating');
    const commentInput = screen.getByLabelText('Comment');
    const submitButton = screen.getByText('Submit Review');

    fireEvent.change(ratingInput, { target: { value: 4 } });
    fireEvent.change(commentInput, { target: { value: 'Test review' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to submit review.')).toBeInTheDocument();
    });
  });

  it('prevents user from submitting multiple reviews', () => {
    render(<EventReview eventId="event1" userId="user1" />);
    
    expect(screen.getByText('You have already reviewed this event.')).toBeInTheDocument();
    expect(screen.queryByText('Write a Review')).not.toBeInTheDocument();
  });

  it('clears form after successful submission', async () => {
    render(<EventReview eventId="event1" userId="user3" />);
    
    const ratingInput = screen.getByLabelText('Rating');
    const commentInput = screen.getByLabelText('Comment');
    const submitButton = screen.getByText('Submit Review');

    fireEvent.change(ratingInput, { target: { value: 4 } });
    fireEvent.change(commentInput, { target: { value: 'Test review' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(ratingInput).toHaveValue(0);
      expect(commentInput).toHaveValue('');
    });
  });

  it('requires comment field', () => {
    render(<EventReview eventId="event1" userId="user3" />);
    
    const commentInput = screen.getByLabelText('Comment');
    expect(commentInput).toBeRequired();
  });

  it('handles rating change', () => {
    render(<EventReview eventId="event1" userId="user3" />);
    
    const ratingInput = screen.getByLabelText('Rating');
    fireEvent.change(ratingInput, { target: { value: 3.5 } });
    
    expect(ratingInput).toHaveValue(3.5);
  });

  it('refetches reviews after successful submission', async () => {
    render(<EventReview eventId="event1" userId="user3" />);
    
    const ratingInput = screen.getByLabelText('Rating');
    const commentInput = screen.getByLabelText('Comment');
    const submitButton = screen.getByText('Submit Review');

    fireEvent.change(ratingInput, { target: { value: 4 } });
    fireEvent.change(commentInput, { target: { value: 'Test review' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('renders review form when open', () => {
    renderWithProvider(<EventReview {...defaultProps} />);
    
    expect(screen.getByText('Review Event')).toBeInTheDocument();
    expect(screen.getByLabelText('Rating')).toBeInTheDocument();
    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProvider(<EventReview {...defaultProps} open={false} />);
    
    expect(screen.queryByText('Review Event')).not.toBeInTheDocument();
  });

  it('handles comment change', () => {
    renderWithProvider(<EventReview {...defaultProps} />);
    
    const commentInput = screen.getByLabelText('Comment');
    fireEvent.change(commentInput, { target: { value: 'Great event!' } });
    
    expect(commentInput).toHaveValue('Great event!');
  });

  it('handles form submission', () => {
    renderWithProvider(<EventReview {...defaultProps} />);
    
    const ratingInput = screen.getByLabelText('Rating');
    const commentInput = screen.getByLabelText('Comment');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(ratingInput, { target: { value: '4' } });
    fireEvent.change(commentInput, { target: { value: 'Great event!' } });
    fireEvent.click(submitButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('handles close button click', () => {
    renderWithProvider(<EventReview {...defaultProps} />);
    
    const closeButton = screen.getByText('Cancel');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('validates required fields', () => {
    renderWithProvider(<EventReview {...defaultProps} />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Rating is required')).toBeInTheDocument();
  });

  it('shows loading state during submission', () => {
    renderWithProvider(<EventReview {...defaultProps} />);
    
    const ratingInput = screen.getByLabelText('Rating');
    const commentInput = screen.getByLabelText('Comment');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(ratingInput, { target: { value: '4' } });
    fireEvent.change(commentInput, { target: { value: 'Great event!' } });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });
}); 