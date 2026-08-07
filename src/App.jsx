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
        </Routes>
      </Layout>
    </HashRouter>
  );
}
