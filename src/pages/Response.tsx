import React from 'react';
import { Timer } from '../components/Timer';
import { Scenario } from '../components/Scenario';
import { useExam } from '../context/ExamContext';
import { ArrowRight } from 'lucide-react';

const questions = [
  'What are the immediate steps you would take in this situation?',
  'How would you balance professional obligations with colleague relationships?',
  'What long-term measures could prevent similar situations in the future?',
];

export function Response() {
  const { state, dispatch } = useExam();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Response Phase</h1>
        <Timer />
      </div>

      <Scenario />

      <div className="mt-8 space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              {question}
            </label>
            <textarea
              value={state.responses[index]}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_RESPONSE',
                  index,
                  value: e.target.value,
                })
              }
              className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your response here..."
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => dispatch({ type: 'SUBMIT_EXAM' })}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Submit Responses
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}