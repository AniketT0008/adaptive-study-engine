import { HashRouter, Link, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import DeckView from './components/DeckView.jsx';
import ReviewSession from './components/ReviewSession.jsx';
import Dashboard from './components/Dashboard.jsx';
import LearnMode from './components/LearnMode.jsx';
import AppErrorBoundary from './components/AppErrorBoundary.jsx';
import './index.css';

function AppRoutes() {
  const location = useLocation();
  return (
    <Layout>
      <Routes location={location} key={`${location.pathname}${location.search}`}>
        <Route path="/" element={<Home />} />
        <Route path="/deck/:id" element={<DeckView />} />
        <Route path="/learn/:id" element={<LearnMode />} />
        <Route path="/review/:id" element={<ReviewSession />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="*" element={
          <div className="flex items-center justify-center py-20">
            <div className="glass p-8 rounded-2xl text-center max-w-md space-y-4">
              <h2 className="text-xl font-bold text-[var(--color-text)]">Page not found</h2>
              <p className="text-sm text-[var(--color-text-muted)]">That route is not part of Synapse.</p>
              <Link to="/" className="btn-primary inline-block">Go Home</Link>
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppErrorBoundary>
        <AppRoutes />
      </AppErrorBoundary>
    </HashRouter>
  );
}
