/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import OutfitOptionPoll from './OutfitOptionPoll';
import type { OutfitGenerationOption } from '../../types';

const mockOptions: OutfitGenerationOption[] = [
    { label: 'Single Outfit', description: 'Generate one complete outfit', value: 'single' },
    { label: 'Multiple Outfits', description: 'Generate several outfit options', value: 'multiple' },
    { label: 'Capsule Wardrobe', description: 'Create a coordinated wardrobe', value: 'capsule' },
];

describe('OutfitOptionPoll', () => {
    it('renders all outfit options', () => {
        const onSelect = vi.fn();
        render(<OutfitOptionPoll options={mockOptions} onSelect={onSelect} />);

        mockOptions.forEach((option) => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
            expect(screen.getByText(option.description)).toBeInTheDocument();
        });
    });

    it('calls onSelect when option is clicked', () => {
        const onSelect = vi.fn();
        render(<OutfitOptionPoll options={mockOptions} onSelect={onSelect} />);

        const firstOption = screen.getByText('Single Outfit');
        fireEvent.click(firstOption);

        expect(onSelect).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('does not call onSelect when disabled', () => {
        const onSelect = vi.fn();
        render(<OutfitOptionPoll options={mockOptions} onSelect={onSelect} disabled />);

        const firstOption = screen.getByText('Single Outfit');
        fireEvent.click(firstOption);

        expect(onSelect).not.toHaveBeenCalled();
    });

    it('applies disabled styles when disabled', () => {
        const onSelect = vi.fn();
        render(<OutfitOptionPoll options={mockOptions} onSelect={onSelect} disabled />);

        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
            expect(button).toBeDisabled();
            expect(button.className).toContain('cursor-not-allowed');
        });
    });

    it('renders correct number of options', () => {
        const onSelect = vi.fn();
        render(<OutfitOptionPoll options={mockOptions} onSelect={onSelect} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(mockOptions.length);
    });
});
