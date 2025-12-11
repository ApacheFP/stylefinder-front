/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import BudgetPoll from './BudgetPoll';
import type { BudgetOption } from '../../types';

const mockOptions: BudgetOption[] = [
    { label: '$0 - $50', description: 'Budget-friendly options', min: 0, max: 50 },
    { label: '$50 - $100', description: 'Mid-range selection', min: 50, max: 100 },
    { label: '$100 - $200', description: 'Premium choices', min: 100, max: 200 },
    { label: '$200+', description: 'Luxury items', min: 200, max: 1000 },
];

describe('BudgetPoll', () => {
    it('renders all budget options', () => {
        const onSelect = vi.fn();
        render(<BudgetPoll options={mockOptions} onSelect={onSelect} />);

        mockOptions.forEach((option) => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
            expect(screen.getByText(option.description)).toBeInTheDocument();
        });
    });

    it('calls onSelect when option is clicked', () => {
        const onSelect = vi.fn();
        render(<BudgetPoll options={mockOptions} onSelect={onSelect} />);

        const firstOption = screen.getByText('$0 - $50');
        fireEvent.click(firstOption);

        expect(onSelect).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('does not call onSelect when disabled', () => {
        const onSelect = vi.fn();
        render(<BudgetPoll options={mockOptions} onSelect={onSelect} disabled />);

        const firstOption = screen.getByText('$0 - $50');
        fireEvent.click(firstOption);

        expect(onSelect).not.toHaveBeenCalled();
    });

    it('applies disabled styles when disabled', () => {
        const onSelect = vi.fn();
        render(<BudgetPoll options={mockOptions} onSelect={onSelect} disabled />);

        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
            expect(button).toBeDisabled();
            expect(button.className).toContain('cursor-not-allowed');
        });
    });

    it('renders correct number of options', () => {
        const onSelect = vi.fn();
        render(<BudgetPoll options={mockOptions} onSelect={onSelect} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(mockOptions.length);
    });
});
