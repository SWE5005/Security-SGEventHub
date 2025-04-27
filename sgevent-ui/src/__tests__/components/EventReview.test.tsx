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
  const mockReviews = [
    {
      userId: 'user1',
      rating: 4,
      comment: 'Great event!',
    },
    {
      userId: 'user2',
      rating: 5,
      comment: 'Excellent experience!',
    },
  ];

  const mockGetEventReviewsQuery = useGetEventReviewsQuery as jest.Mock;
  const mockPostEventReviewMutation = usePostEventReviewMutation as jest.Mock;

  beforeEach(() => {
    mockGetEventReviewsQuery.mockReturnValue({
      data: mockReviews,
      isLoading: false,
      refetch: jest.fn(),
    });

    mockPostEventReviewMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: true }),
      { isLoading: false },
    ]);
  });

  it('renders reviews correctly', () => {
    render(<EventReview eventId="event1" userId="user3" />);
    
    expect(screen.getByText('Event Reviews')).toBeInTheDocument();
    expect(screen.getByText('Great event!')).toBeInTheDocument();
    expect(screen.getByText('Excellent experience!')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockGetEventReviewsQuery.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn(),
    });

    render(<EventReview eventId="event1" userId="user3" />);
    
    expect(screen.getByText('Loading reviews...')).toBeInTheDocument();
  });

  it('shows no reviews message when there are no reviews', () => {
    mockGetEventReviewsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<EventReview eventId="event1" userId="user3" />);
    
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  it('allows user to submit a review when they have not reviewed', async () => {
    render(<EventReview eventId="event1" userId="user3" />);
    
    const rating = screen.getByRole('slider');
    fireEvent.change(rating, { target: { value: 4 } });
    
    const commentInput = screen.getByLabelText('Comment');
    fireEvent.change(commentInput, { target: { value: 'Test review' } });
    
    const submitButton = screen.getByText('Submit Review');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Review submitted successfully.')).toBeInTheDocument();
    });
  });

  it('shows message when user has already reviewed', () => {
    mockGetEventReviewsQuery.mockReturnValue({
      data: [
        {
          userId: 'user3',
          rating: 4,
          comment: 'Previous review',
        },
      ],
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<EventReview eventId="event1" userId="user3" />);
    
    expect(screen.getByText('You have already reviewed this event.')).toBeInTheDocument();
  });

  it('handles review submission error', async () => {
    mockPostEventReviewMutation.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Failed to submit')),
      { isLoading: false },
    ]);

    render(<EventReview eventId="event1" userId="user3" />);
    
    const rating = screen.getByRole('slider');
    fireEvent.change(rating, { target: { value: 4 } });
    
    const commentInput = screen.getByLabelText('Comment');
    fireEvent.change(commentInput, { target: { value: 'Test review' } });
    
    const submitButton = screen.getByText('Submit Review');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to submit review.')).toBeInTheDocument();
    });
  });
}); 