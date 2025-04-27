import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EventCard from '../../components/EventCard';
import { selectAuthSlice } from '../../state/auth/slice';

// Mock the auth slice
jest.mock('../../state/auth/slice', () => ({
  selectAuthSlice: jest.fn(),
}));

describe('EventCard Component', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    startDatetime: '2024-04-01T10:00:00Z',
    registrationCount: 5,
    capacity: 10,
    location: 'Test Location',
    cover: 'test-image.jpg',
    registered: false,
  };

  const mockProps = {
    value: mockEvent,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onRegister: jest.fn(),
    onDetails: jest.fn(),
    isAdmin: false,
    isRegistering: false,
  };

  const mockStore = configureStore({
    reducer: {
      auth: (state = { userInfo: { user_role: 'USER' } }, action) => state,
    },
  });

  beforeEach(() => {
    (selectAuthSlice as jest.Mock).mockReturnValue({
      userInfo: { user_role: 'USER' },
    });
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        {ui}
      </Provider>
    );
  };

  it('renders event information correctly', () => {
    renderWithProvider(<EventCard {...mockProps} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Event Time:/)).toBeInTheDocument();
    expect(screen.getByText(/Capacity: 5\/10/)).toBeInTheDocument();
    expect(screen.getByText(/Location: Test Location/)).toBeInTheDocument();
  });

  it('shows admin controls when isAdmin is true', () => {
    renderWithProvider(<EventCard {...mockProps} isAdmin={true} />);
    
    const editButton = screen.getByLabelText('Edit');
    expect(editButton).toBeInTheDocument();
    
    const deleteButton = screen.getByText('Delete event?');
    expect(deleteButton).toBeInTheDocument();
  });

  it('shows user controls when isAdmin is false', () => {
    renderWithProvider(<EventCard {...mockProps} />);
    
    const joinButton = screen.getByText('Join');
    expect(joinButton).toBeInTheDocument();
    
    const detailsButton = screen.getByText('Details');
    expect(detailsButton).toBeInTheDocument();
  });

  it('handles edit button click', () => {
    renderWithProvider(<EventCard {...mockProps} isAdmin={true} />);
    
    const editButton = screen.getByLabelText('Edit');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith('1');
  });

  it('handles delete button click', () => {
    renderWithProvider(<EventCard {...mockProps} isAdmin={true} />);
    
    const deleteButton = screen.getByText('Delete event?');
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('handles register button click', () => {
    renderWithProvider(<EventCard {...mockProps} />);
    
    const joinButton = screen.getByText('Join');
    fireEvent.click(joinButton);
    
    expect(mockProps.onRegister).toHaveBeenCalledWith({
      type: 'REGISTER',
      eventId: '1',
    });
  });

  it('handles unregister button click when already registered', () => {
    renderWithProvider(<EventCard {...mockProps} value={{ ...mockEvent, registered: true }} />);
    
    const leaveButton = screen.getByText('Leave');
    fireEvent.click(leaveButton);
    
    expect(mockProps.onRegister).toHaveBeenCalledWith({
      type: 'UNREGISTER',
      eventId: '1',
    });
  });

  it('handles details button click', () => {
    renderWithProvider(<EventCard {...mockProps} />);
    
    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);
    
    expect(mockProps.onDetails).toHaveBeenCalledWith('1');
  });

  it('shows loading state for register button', () => {
    renderWithProvider(<EventCard {...mockProps} isRegistering={true} />);
    
    const joinButton = screen.getByText('Join');
    expect(joinButton).toBeDisabled();
  });

  it('renders skeleton when value is null', () => {
    renderWithProvider(<EventCard {...mockProps} value={null} />);
    
    const skeletons = screen.getAllByRole('progressbar');
    expect(skeletons.length).toBeGreaterThan(0);
  });
}); 