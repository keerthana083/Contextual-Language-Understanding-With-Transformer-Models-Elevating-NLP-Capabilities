import React, { useState } from 'react';
import { HelpCircle, Loader } from 'lucide-react';
import { hf } from '../utils/api';

const QuestionAnswering: React.FC = () => {
  const [context, setContext] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAnswer = async () => {
    if (!context.trim() || !question.trim()) {
      setError('Please provide both context and question');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await hf.questionAnswering({
        model: 'deepset/roberta-base-squad2',
        inputs: {
          question,
          context,
        },
      });
      
      if (!response || !response.answer) {
        throw new Error('Invalid response from API');
      }

      setAnswer(response.answer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get answer. Please try again.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Question Answering</h1>
        
        <div className="mb-6">
          <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
            Context
          </label>
          <textarea
            id="context"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter the context or passage..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <input
            type="text"
            id="question"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
          />
        </div>

        <button
          onClick={getAnswer}
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading 
              ? 'bg-purple-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Finding Answer...
            </span>
          ) : (
            'Get Answer'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {answer && !error && (
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Answer</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionAnswering;