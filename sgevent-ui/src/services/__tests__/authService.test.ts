import { authService } from '../authService';

// Mock the fetch function
global.fetch = jest.fn();

describe('Auth Service', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should login successfully', async () => {
    const mockResponse = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await authService.login('test@example.com', 'password');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password'
        })
      })
    );
  });

  it('should handle login failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid credentials' })
    });

    await expect(authService.login('test@example.com', 'wrong-password'))
      .rejects
      .toThrow('Invalid credentials');
  });

  it('should logout successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Logged out successfully' })
    });

    await authService.logout();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({
        method: 'POST'
      })
    );
  });
}); 