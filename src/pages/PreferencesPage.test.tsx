/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PreferencesPage from './PreferencesPage';
import { preferencesService } from '../services/preferencesService';
import { showToast } from '../utils/toast';
import { triggerSuccessConfetti } from '../utils/confetti';

// Mock services
vi.mock('../services/preferencesService', () => ({
    preferencesService: {
        getPreferences: vi.fn(),
        getAllPreferences: vi.fn(),
        updatePreferences: vi.fn(),
    },
}));

vi.mock('../utils/toast', () => ({
    showToast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('../utils/confetti', () => ({
    triggerSuccessConfetti: vi.fn(),
}));

// Mock components
vi.mock('../components/ui/Button', () => ({
    default: ({ children, onClick, isLoading }: any) => (
        <button onClick={onClick} disabled={isLoading}>
            {isLoading ? 'Loading...' : children}
        </button>
    ),
}));

vi.mock('../components/ui/Skeleton', () => ({
    default: () => <div data-testid="skeleton" />,
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('PreferencesPage', () => {
    const mockAllPreferences = [
        { id: 1, name: 'gender' },
        { id: 2, name: 'style_casual' },
        { id: 3, name: 'color_blue' },
        { id: 4, name: 'brand_nike' },
        { id: 5, name: 'other_pref' },
    ];

    const mockUserPreferences = {
        gender: 'man',
        style_casual: 'true',
        color_blue: 'false',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (preferencesService.getAllPreferences as any).mockResolvedValue(mockAllPreferences);
        (preferencesService.getPreferences as any).mockResolvedValue(mockUserPreferences);
    });

    it('renders loading state initially', async () => {
        // Delay resolution to check loading state
        (preferencesService.getAllPreferences as any).mockImplementation(() => new Promise(() => { }));

        render(
            <BrowserRouter>
                <PreferencesPage />
            </BrowserRouter>
        );

        expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    });

    it('renders preferences when loaded', async () => {
        render(
            <BrowserRouter>
                <PreferencesPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Your Preferences')).toBeInTheDocument();
            expect(screen.getByText('Gender')).toBeInTheDocument();
            expect(screen.getByText('Favorite Styles')).toBeInTheDocument();
            expect(screen.getByText('Favorite Colors')).toBeInTheDocument();
            expect(screen.getByText('Favorite Brands')).toBeInTheDocument();
            expect(screen.getByText('Other Preferences')).toBeInTheDocument();
        });
    });

    it('handles loading failure', async () => {
        (preferencesService.getAllPreferences as any).mockRejectedValue(new Error('Failed'));

        render(
            <BrowserRouter>
                <PreferencesPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Unable to load preferences options. Please try again later.')).toBeInTheDocument();
        });
    });

    it('toggles preferences', async () => {
        render(
            <BrowserRouter>
                <PreferencesPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Casual')).toBeInTheDocument();
        });

        // Toggle Style
        const casualBtn = screen.getByText('Casual');
        fireEvent.click(casualBtn);

        // Toggle Color
        const blueBtn = screen.getByText('Blue');
        fireEvent.click(blueBtn);

        // Toggle Brand
        const nikeBtn = screen.getByText('Nike');
        fireEvent.click(nikeBtn);

        // Change Other
        const otherInput = screen.getByDisplayValue(''); // other_pref is initially empty/undefined in mockUserPreferences
        fireEvent.change(otherInput, { target: { value: 'Something' } });

        const saveBtn = screen.getByText('Save Preferences');
        (preferencesService.updatePreferences as any).mockResolvedValue(true);

        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(preferencesService.updatePreferences).toHaveBeenCalledWith(expect.objectContaining({
                style_casual: 'false', // Toggled from true
                color_blue: 'true',    // Toggled from false
                brand_nike: 'true',    // Toggled from undefined (false)
                other_pref: 'Something'
            }));
        });
    });
    it('saves preferences successfully', async () => {
        (preferencesService.updatePreferences as any).mockResolvedValue(true);

        render(
            <BrowserRouter>
                <PreferencesPage />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Save Preferences'));

        fireEvent.click(screen.getByText('Save Preferences'));

        await waitFor(() => {
            expect(preferencesService.updatePreferences).toHaveBeenCalled();
            expect(triggerSuccessConfetti).toHaveBeenCalled();
            expect(showToast.success).toHaveBeenCalledWith('Preferences saved!');
            // Navigate is called after timeout, might be tricky to test without fake timers
        });
    });

    it('handles save failure', async () => {
        (preferencesService.updatePreferences as any).mockResolvedValue(false);

        render(
            <BrowserRouter>
                <PreferencesPage />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Save Preferences'));

        fireEvent.click(screen.getByText('Save Preferences'));

        await waitFor(() => {
            expect(showToast.error).toHaveBeenCalledWith('Failed to save preferences');
        });
    });

    it('handles close', async () => {
        render(
            <BrowserRouter>
                <PreferencesPage />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Close'));

        fireEvent.click(screen.getByText('Close'));

        expect(mockNavigate).toHaveBeenCalledWith('/chat');
    });
});
