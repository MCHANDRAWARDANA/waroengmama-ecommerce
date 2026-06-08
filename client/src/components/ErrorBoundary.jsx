import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // keep a console log for debugging
    // In production you might send this to a logging service
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
    this.setState({ errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-5 py-16">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Terjadi kesalahan
            </h2>
            <p className="text-slate-600 mb-4">
              Maaf, terjadi kesalahan pada aplikasi.
            </p>
            <div className="text-left">
              <pre className="text-sm overflow-auto max-h-40 p-2 bg-slate-50 rounded">
                {this.state.error?.stack || String(this.state.error)}
              </pre>
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-3 text-xs text-slate-500 overflow-auto max-h-40 p-2 bg-slate-50 rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
