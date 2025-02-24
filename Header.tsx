import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain size={32} />
            <span className="text-2xl font-bold">NLP</span>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/sentiment" className="hover:text-purple-200">Sentiment Analysis</Link>
              </li>
              <li>
                <Link to="/summarization" className="hover:text-purple-200">Text Summarization</Link>
              </li>
              <li>
                <Link to="/qa" className="hover:text-purple-200">Question Answering</Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-purple-200">Chatbot</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;