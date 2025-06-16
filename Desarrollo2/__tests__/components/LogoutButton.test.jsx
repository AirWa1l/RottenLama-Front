import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Swal from 'sweetalert2';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LogoutButton from '../../src/components/LogoutButton/logoutButton';
import useAuth from '../../src/API/auth';

jest.mock('sweetalert2');
jest.mock('../../src/API/auth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renderiza correctamente', () => {
    useAuth.mockReturnValue({ logout: jest.fn() });

    render(
      <BrowserRouter>
        <LogoutButton />
      </BrowserRouter>
    );

    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  test('llama a logout si el usuario confirma en SweetAlert', async () => {
    const logoutMock = jest.fn();
    useAuth.mockReturnValue({ logout: logoutMock });

    Swal.fire.mockResolvedValue({ isConfirmed: true });

    render(
      <BrowserRouter>
        <LogoutButton />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Cerrar sesión'));

    await Promise.resolve();

    expect(Swal.fire).toHaveBeenCalled();
    expect(logoutMock).toHaveBeenCalled();
  });

  test('no llama a logout si el usuario cancela en SweetAlert', async () => {
    const logoutMock = jest.fn();
    useAuth.mockReturnValue({ logout: logoutMock });

    Swal.fire.mockResolvedValue({ isConfirmed: false });

    render(
      <BrowserRouter>
        <LogoutButton />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Cerrar sesión'));

    await Promise.resolve();

    expect(Swal.fire).toHaveBeenCalled();
    expect(logoutMock).not.toHaveBeenCalled();
  });

  test('borra el localStorage al confirmar logout', async () => {
    localStorage.setItem('token', '123abc');
    expect(localStorage.getItem('token')).toBe('123abc');

    Swal.fire.mockResolvedValue({ isConfirmed: true });

    useAuth.mockReturnValue({
      logout: () => {
        localStorage.removeItem('token');
      },
    });

    render(
      <BrowserRouter>
        <LogoutButton />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Cerrar sesión'));

    await Promise.resolve();

    expect(localStorage.getItem('token')).toBeNull();
  });
});

