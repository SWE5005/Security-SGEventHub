import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';

export const mockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = initialState) => state
    }
  });
};

export const renderWithStore = (ui: React.ReactElement, initialState = {}) => {
  const store = mockStore(initialState);
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
};

export const mockUser = {
  id: '1',
  username: 'testuser',
  role: 'USER',
  permissions: ['CREATE_EVENT', 'EDIT_EVENT']
};

export const mockAdmin = {
  id: '2',
  username: 'admin',
  role: 'ADMIN',
  permissions: ['CREATE_EVENT', 'EDIT_EVENT', 'DELETE_EVENT']
}; 