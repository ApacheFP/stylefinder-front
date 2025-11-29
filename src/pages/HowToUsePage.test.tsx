import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HowToUsePage from './HowToUsePage';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('HowToUsePage', () => {
    it('renders correctly', () => {
        render(
            <BrowserRouter>
                <HowToUsePage />
            </BrowserRouter>
        );

        expect(screen.getByText('How to Use StyleFinder')).toBeInTheDocument();
        expect(screen.getByText('Chat with AI')).toBeInTheDocument();
        expect(screen.getByText('Create Your Profile')).toBeInTheDocument();
        expect(screen.getByText('Set Preferences')).toBeInTheDocument();
        expect(screen.getByText('Get Recommendations')).toBeInTheDocument();
        expect(screen.getByText('Pro Tips')).toBeInTheDocument();
    });

    it('navigates back on button click', () => {
        render(
            <BrowserRouter>
                <HowToUsePage />
            </BrowserRouter>
        );

        const backButton = screen.getByRole('button');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
