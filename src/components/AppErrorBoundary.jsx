import { Component } from 'react';

export default class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Synapse could not render this screen.', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="min-h-screen bg-[var(--color-surface)] px-6 py-20 text-center text-[var(--color-text)]">
        <div className="glass-strong mx-auto max-w-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold">This screen could not load</h1>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Your saved study data is still in this browser. Reload the app or return home to continue.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>Reload</button>
            <a className="btn-primary" href="#/">Return home</a>
          </div>
        </div>
      </main>
    );
  }
}

