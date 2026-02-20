// src/dashboard/layout/DashboardErrorBoundary.jsx
import { Component } from 'react';

export default class DashboardErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Dashboard Error:', error, errorInfo);
        this.setState({ error });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-black text-white">
                    <div className="text-center max-w-md">
                        <h2 className="text-xl font-bold mb-4">Dashboard Error</h2>
                        <p className="text-gray-400 mb-6">
                            Something went wrong with the dashboard. Please try refreshing.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                        >
                            Refresh Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}