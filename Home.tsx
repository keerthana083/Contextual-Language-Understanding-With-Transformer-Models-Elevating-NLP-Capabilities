import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, FileText, HelpCircle } from 'lucide-react';

const features = [
  {
    icon: ThumbsUp,
    title: 'Sentiment Analysis',
    description: 'Analyze text sentiment to determine if it\'s positive, negative, or neutral.',
    link: '/sentiment'
  },
  {
    icon: FileText,
    title: 'Text Summarization',
    description: 'Generate concise summaries from long documents automatically.',
    link: '/summarization'
  },
  {
    icon: HelpCircle,
    title: 'Question Answering',
    description: 'Get accurate answers to questions based on provided context.',
    link: '/qa'
  },
  {
    icon: MessageSquare,
    title: 'Chatbot',
    description: 'Engage in natural conversations with our AI-powered chatbot.',
    link: '/chatbot'
  }
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
           NLP Solutions
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Harness the power of transformer models for natural language processing tasks.
            Experience state-of-the-art language understanding and generation.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-md">
                      <Icon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;