/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Mock useAuth
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock Skeleton
vi.mock('./ui/Skeleton', () => ({
    default: () => <div data-testid="skeleton" />,
}));

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});
