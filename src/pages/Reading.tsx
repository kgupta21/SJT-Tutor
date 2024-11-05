import React from 'react';
import { Timer } from '../components/Timer';
import { Scenario } from '../components/Scenario';
import { useExam } from '../context/ExamContext';
import { ArrowRight } from 'lucide-react';

export function Reading() {
  const { dispatch } = useExam();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Reading Phase</h1>
        <Timer />
      </div>
      <Scenario />
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-gray-600 text-center">
          Please read the scenario carefully. The response phase will begin
          automatically when the timer expires.
        </p>
        <button
          onClick={() => dispatch({ type: 'START_RESPONSE' })}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue to Response Phase
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}