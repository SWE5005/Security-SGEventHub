import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EventList from '../../components/EventList';
import { useGetEventListQuery, useDeleteEventMutation, useRegisterEventMutation } from '../../services/event.service';

// Mock the gatsby navigate function
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

// Mock the event service
jest.mock('../../services/event.service', () => ({
  useGetEventListQuery: jest.fn(),
  useDeleteEventMutation: jest.fn(),
  useRegisterEventMutation: jest.fn(),
}));

describe('EventList Component', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Event 1',
      description: 'Description 1',
      startDatetime: '2024-04-01T10:00:00Z',
      registrationCount: 5,
      capacity: 10,
      location: 'Location 1',
      cover: 'cover1.jpg',
      registered: false,
    },
    {
      id: '2',
      title: 'Event 2',
      description: 'Description 2',
      startDatetime: '2024-04-02T10:00:00Z',
      registrationCount: 3,
      capacity: 8,
      location: 'Location 2',
      cover: 'cover2.jpg',
      registered: true,
    },
  ];

  const mockGetEventListQuery = useGetEventListQuery as jest.Mock;
  const mockDeleteEventMutation = useDeleteEventMutation as jest.Mock;
  const mockRegisterEventMutation = useRegisterEventMutation as jest.Mock;

  beforeEach(() => {
    mockGetEventListQuery.mockReturnValue({
      data: mockEvents,
      isFetching: false,
      refetch: jest.fn(),
    });

    mockDeleteEventMutation.mockReturnValue([
      jest.fn(),
      { isSuccess: false, isLoading: false },
    ]);

    mockRegisterEventMutation.mockReturnValue([
      jest.fn(),
      { isSuccess: false, isLoading: false },
    ]);
  });

  it('renders list of events', () => {
    render(<EventList isAdmin={false} />);
    
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockGetEventListQuery.mockReturnValue({
      data: null,
      isFetching: true,
      refetch: jest.fn(),
    });

    render(<EventList isAdmin={false} />);
    
    const skeletons = screen.getAllByRole('progressbar');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles empty event list', () => {
    mockGetEventListQuery.mockReturnValue({
      data: [],
      isFetching: false,
      refetch: jest.fn(),
    });

    render(<EventList isAdmin={false} />);
    
    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', () => {
    render(<EventList isAdmin={true} />);
    
    const editButtons = screen.getAllByLabelText('Edit');
    editButtons[0].click();
    
    expect(require('gatsby').navigate).toHaveBeenCalledWith('/events/edit?eventid=1');
  });

  it('navigates to details page when details button is clicked', () => {
    render(<EventList isAdmin={false} />);
    
    const detailsButtons = screen.getAllByText('Details');
    detailsButtons[0].click();
    
    expect(require('gatsby').navigate).toHaveBeenCalledWith('/events/details?eventid=1');
  });

  it('refetches data after successful deletion', async () => {
    const refetch = jest.fn();
    mockGetEventListQuery.mockReturnValue({
      data: mockEvents,
      isFetching: false,
      refetch,
    });

    mockDeleteEventMutation.mockReturnValue([
      jest.fn(),
      { isSuccess: true, isLoading: false },
    ]);

    render(<EventList isAdmin={true} />);
    
    await waitFor(() => {
      expect(refetch).toHaveBeenCalled();
    });
  });

  it('refetches data after successful registration', async () => {
    const refetch = jest.fn();
    mockGetEventListQuery.mockReturnValue({
      data: mockEvents,
      isFetching: false,
      refetch,
    });

    mockRegisterEventMutation.mockReturnValue([
      jest.fn(),
      { isSuccess: true, isLoading: false },
    ]);

    render(<EventList isAdmin={false} />);
    
    await waitFor(() => {
      expect(refetch).toHaveBeenCalled();
    });
  });

  it('shows loading state for specific event registration', () => {
    mockRegisterEventMutation.mockReturnValue([
      jest.fn(),
      { isSuccess: false, isLoading: true, originalArgs: { eventId: '1' } },
    ]);

    render(<EventList isAdmin={false} />);
    
    const joinButton = screen.getByText('Join');
    expect(joinButton).toBeDisabled();
  });
}); 