import React from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export function Results() {
  const { state, dispatch } = useExam();

  const handleReturnHome = () => {
    dispatch({ type: 'RESET_EXAM' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Exam Completed</h1>
        <p className="text-gray-600 mt-2">
          Your responses have been recorded successfully
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Your Responses</h2>
        <div className="space-y-8">
          {state.responses.map((response, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                Question {index + 1}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p className="mb-6">
          Coming soon: AI-powered feedback and scoring system to help you improve
          your responses.
        </p>
        <button
          onClick={handleReturnHome}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </button>
      </div>
    </div>
  );
}
