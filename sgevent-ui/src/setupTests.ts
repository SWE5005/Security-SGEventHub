import '@testing-library/jest-dom';

// Mock gatsby
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
  useStaticQuery: jest.fn(),
})); 