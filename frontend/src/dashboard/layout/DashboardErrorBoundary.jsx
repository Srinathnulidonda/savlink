// src/dashboard/layout/DashboardErrorBoundary.jsx

import React from 'react';
import { motion } from 'framer-motion';

class DashboardErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Dashboard Error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        if (process.env.NODE_ENV === 'production') {
        }
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }));
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md"
                    >
                        {/* Error Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6"
                        >
                            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Something went wrong
                        </h1>
                        
                        <p className="text-gray-400 mb-8">
                            {this.state.retryCount > 0 
                                ? "The error persisted after retry. Please try reloading the page."
                                : "We encountered an unexpected error in the dashboard."
                            }
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {this.state.retryCount < 2 ? (
                                <motion.button
                                    onClick={this.handleRetry}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
                                >
                                    Try Again
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={this.handleReload}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
                                >
                                    Reload Page
                                </motion.button>
                            )}

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>

                        {/* Debug Info for Development */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <motion.details 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 text-left"
                            >
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                                    Error Details (Development Only)
                                </summary>
                                <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
                                    <pre className="text-xs text-red-400 whitespace-pre-wrap overflow-auto max-h-48">
                                        <strong>Error:</strong> {this.state.error.toString()}
                                        {this.state.errorInfo && (
                                            <>
                                                {'\n\n'}
                                                <strong>Component Stack:</strong>
                                                {this.state.errorInfo.componentStack}
                                            </>
                                        )}
                                    </pre>
                                </div>
                            </motion.details>
                        )}
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default DashboardErrorBoundary;