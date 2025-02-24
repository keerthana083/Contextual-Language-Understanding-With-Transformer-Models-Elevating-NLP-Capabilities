import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SentimentAnalysis from './pages/SentimentAnalysis';
import TextSummarization from './pages/TextSummarization';
import QuestionAnswering from './pages/QuestionAnswering';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sentiment" element={<SentimentAnalysis />} />
            <Route path="/summarization" element={<TextSummarization />} />
            <Route path="/qa" element={<QuestionAnswering />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;