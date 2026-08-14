import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import DeckView from './components/DeckView.jsx';
import ReviewSession from './components/ReviewSession.jsx';
import Dashboard from './components/Dashboard.jsx';
import LearnMode from './components/LearnMode.jsx';
import './index.css';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
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
                <a href="#/" className="btn-primary inline-block">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
