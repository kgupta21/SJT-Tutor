import React from 'react';
import { useExam } from '../context/ExamContext';

export function Scenario() {
  const { state } = useExam();

  if (!state.scenario) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 italic">No scenario loaded. Please generate a scenario first.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Medical Ethics Scenario</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{state.scenario.scenario}</p>
      
      <h3 className="text-lg font-semibold mb-3">Questions to Consider:</h3>
      <ol className="list-decimal list-inside space-y-3">
        {state.scenario.questions.map((question, index) => (
          <li key={index} className="text-gray-700">{question}</li>
        ))}
      </ol>
    </div>
  );
}
