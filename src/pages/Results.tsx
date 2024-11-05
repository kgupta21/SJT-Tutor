import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export function Results() {
  const { state } = useExam();

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
        <p>
          Coming soon: AI-powered feedback and scoring system to help you improve
          your responses.
        </p>
      </div>
    </div>
  );
}