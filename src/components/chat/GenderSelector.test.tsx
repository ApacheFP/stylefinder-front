/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import GenderSelector from './GenderSelector';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, onClick, disabled, ...props }: any) => (
            <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
        ),
    },
}));

describe('GenderSelector', () => {
    it('renders all gender options', () => {
        render(
            <GenderSelector
                selectedGender={null}
                onSelectGender={() => {}}
            />
        );

        expect(screen.getByText('Man')).toBeInTheDocument();
        expect(screen.getByText('Woman')).toBeInTheDocument();
        expect(screen.getByText('Non-Binary')).toBeInTheDocument();
    });

    it('shows instruction text when not disabled', () => {
        render(
            <GenderSelector
                selectedGender={null}
                onSelectGender={() => {}}
            />
        );

        expect(screen.getByText(/Select clothing preference to start/)).toBeInTheDocument();
    });

    it('shows different text when disabled', () => {
        render(
            <GenderSelector
                selectedGender="male"
                onSelectGender={() => {}}
                disabled={true}
            />
        );

        expect(screen.getByText(/Clothing preference/)).toBeInTheDocument();
        expect(screen.getByText(/start a new chat to change/)).toBeInTheDocument();
    });

    it('calls onSelectGender when option is clicked', () => {
        const onSelectGender = vi.fn();
        render(
            <GenderSelector
                selectedGender={null}
                onSelectGender={onSelectGender}
            />
        );

        fireEvent.click(screen.getByText('Woman'));
        expect(onSelectGender).toHaveBeenCalledWith('female');

        fireEvent.click(screen.getByText('Man'));
        expect(onSelectGender).toHaveBeenCalledWith('male');

        fireEvent.click(screen.getByText('Non-Binary'));
        expect(onSelectGender).toHaveBeenCalledWith('non-binary');
    });

    it('does not call onSelectGender when disabled', () => {
        const onSelectGender = vi.fn();
        render(
            <GenderSelector
                selectedGender="male"
                onSelectGender={onSelectGender}
                disabled={true}
            />
        );

        fireEvent.click(screen.getByText('Woman'));
        expect(onSelectGender).not.toHaveBeenCalled();
    });

    it('highlights the selected gender', () => {
        render(
            <GenderSelector
                selectedGender="female"
                onSelectGender={() => {}}
            />
        );

        const womanButton = screen.getByText('Woman').closest('button');
        expect(womanButton).toHaveClass('bg-primary');
    });

    it('shows prompt message when no gender is selected', () => {
        render(
            <GenderSelector
                selectedGender={null}
                onSelectGender={() => {}}
            />
        );

        expect(screen.getByText(/Select clothing preference to start/)).toBeInTheDocument();
    });

    it('applies emphasis styling to buttons when no gender is selected', () => {
        render(
            <GenderSelector
                selectedGender={null}
                onSelectGender={() => {}}
            />
        );

        const manButton = screen.getByText('Man').closest('button');
        expect(manButton).toHaveClass('border-primary/50');
    });
});
