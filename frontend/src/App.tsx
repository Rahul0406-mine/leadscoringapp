
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AgentBuilder from './pages/AgentBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agent-builder" element={<AgentBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
