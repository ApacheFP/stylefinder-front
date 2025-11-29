import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            We apologize for the inconvenience. The application encountered an unexpected error.
                        </p>

                        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-32">
                            <code className="text-xs text-red-500 font-mono">
                                {this.state.error?.message || 'Unknown error'}
                            </code>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all duration-200 w-full group"
                        >
                            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
