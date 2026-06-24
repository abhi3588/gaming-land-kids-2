import { Component } from 'react';

/**
 * ErrorBoundary
 * Catches render/lifecycle errors in child game components and renders a
 * friendly fallback so the rest of the app stays functional.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onBack === 'function') {
      this.props.onBack();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '5rem' }}>😵</div>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.8rem' }}>
            Oops! Something went wrong.
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: 400 }}>
            Don't worry — just go back and try again!
          </p>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre
              style={{
                background: '#fff3f3',
                border: '1px solid #faa',
                borderRadius: 8,
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: '#c00',
                maxWidth: 500,
                textAlign: 'left',
                overflowX: 'auto',
              }}
            >
              {this.state.error.toString()}
            </pre>
          )}
          <button
            className="btn btn-primary"
            onClick={this.handleReset}
            style={{ marginTop: '1rem' }}
          >
            Back to Main Menu
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
