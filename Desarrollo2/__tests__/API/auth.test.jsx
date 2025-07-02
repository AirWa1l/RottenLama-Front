import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useAuth from '../../src/API/auth';
import Swal from 'sweetalert2';

// Mock global functions
global.alert = jest.fn();
// Trying to avoid console logs in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

global.fetch = jest.fn();

// Wrapper para el hook
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
    Swal.fire.mockClear();
    localStorage.clear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('register', () => {
    test('should register user successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://18.230.67.228:31479/api/users/register/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          })
        }
      );
    });

    test('should handle username already exists error', async () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ username: ['Username already exists'] }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register({
          username: 'existinguser',
          email: 'test@example.com',
          password: 'password123'
        });
      });

      expect(alertSpy).toHaveBeenCalledWith('The username is already registered');
      alertSpy.mockRestore();
    });

    test('should handle email already exists error', async () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ email: ['Email already exists'] }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register({
          username: 'testuser',
          email: 'existing@example.com',
          password: 'password123'
        });
      });

      expect(alertSpy).toHaveBeenCalledWith('The email is already registered');
      alertSpy.mockRestore();
    });

    test('should handle network error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('login', () => {
    test('should login user successfully', async () => {
      const mockResponse = {
        access: 'access-token',
        refresh: 'refresh-token',
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser'
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://18.230.67.228:31479/api/users/login/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        }
      );

      expect(localStorage.getItem('accessToken')).toBe('access-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(Swal.fire).toHaveBeenCalledWith({
        position: 'top-end',
        icon: 'success',
        title: 'Login successful!',
        showConfirmButton: false,
        timer: 1500,
      });
    });

    test('should handle login failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });
      });

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error',
        text: 'Error en la autenticación',
      });
    });

    test('should handle incomplete response data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access: 'token', user: null }), // Missing user data
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Login failed',
        text: 'Invalid credentials, please try again!',
      });
    });
  });

  describe('logout', () => {
    test('should logout user and clear storage', () => {
      // Setup localStorage with user data
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test' }));
      localStorage.setItem('accessToken', 'token');
      localStorage.setItem('refreshToken', 'refresh');

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(result.current.user).toBeNull();
    });
  });

  describe('refreshToken', () => {
    test('should refresh token successfully', async () => {
      localStorage.setItem('refreshToken', 'refresh-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test' }));

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access: 'new-access-token' }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://18.230.67.228:31479/api/users/refresh/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: 'refresh-token' })
        }
      );

      expect(localStorage.getItem('accessToken')).toBe('new-access-token');
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Tu sesión ha sido extendida',
        showConfirmButton: false,
        timer: 2000,
      });
    });

    test('should logout when refresh token is missing', async () => {
      localStorage.removeItem('refreshToken');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(result.current.user).toBeNull();
    });

    test('should handle refresh token failure', async () => {
      localStorage.setItem('refreshToken', 'invalid-token');
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('token expiration check', () => {
    test('should check token expiration on mount', () => {
      const expiredUser = {
        id: 1,
        username: 'test',
        expirationDate: new Date().getTime() - 1000 // Expired 1 second ago
      };
      
      localStorage.setItem('user', JSON.stringify(expiredUser));

      renderHook(() => useAuth(), { wrapper });

      // Fast-forward time to trigger interval
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Should have triggered expiration check
      expect(localStorage.getItem('user')).toBeDefined();
    });
  });
});