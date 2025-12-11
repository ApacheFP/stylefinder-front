import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', async () => {
    const actual = await vi.importActual('framer-motion');
    const filterProps = (props: any) => {
        const {
            whileHover, whileTap, whileInView,
            initial, animate, exit, transition, variants,
            layout, layoutId,
            drag, dragConstraints, dragElastic,
            onTap,
            ...validProps
        } = props;
        return validProps;
    };

    return {
        ...actual as any,
        motion: {
            div: ({ children, ...props }: any) => <div {...filterProps(props)}>{children}</div>,
            button: ({ children, ...props }: any) => <button {...filterProps(props)}>{children}</button>,
            span: ({ children, ...props }: any) => <span {...filterProps(props)}>{children}</span>,
            img: ({ ...props }: any) => <img {...filterProps(props)} />,
            textarea: ({ ...props }: any) => <textarea {...filterProps(props)} />,
            h1: ({ children, ...props }: any) => <h1 {...filterProps(props)}>{children}</h1>,
            h2: ({ children, ...props }: any) => <h2 {...filterProps(props)}>{children}</h2>,
            h3: ({ children, ...props }: any) => <h3 {...filterProps(props)}>{children}</h3>,
            p: ({ children, ...props }: any) => <p {...filterProps(props)}>{children}</p>,
            nav: ({ children, ...props }: any) => <nav {...filterProps(props)}>{children}</nav>,
            section: ({ children, ...props }: any) => <section {...filterProps(props)}>{children}</section>,
            a: ({ children, ...props }: any) => <a {...filterProps(props)}>{children}</a>,
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
