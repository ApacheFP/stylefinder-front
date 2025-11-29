/* eslint-disable react-refresh/only-export-components */
import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import '@testing-library/jest-dom';

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
