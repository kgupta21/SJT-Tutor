import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export function Lobby() {
  const { dispatch } = useExam();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Stethoscope className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CASPer Test Simulator
        </h1>
        <p className="text-xl text-gray-600">
          Prepare for your healthcare admissions journey
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Exam Instructions</h2>
        <div className="space-y-4 text-gray-700">
          <p>This simulation consists of the following phases:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Scenario Reading (30 seconds)</li>
            <li>Response Phase (5 minutes)</li>
            <li>Results Review</li>
          </ol>
          <p>
            You will be presented with a medical scenario and asked to respond to
            three follow-up questions. Your responses should demonstrate:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Critical thinking</li>
            <li>Ethical reasoning</li>
            <li>Professional judgment</li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: 'START_EXAM' })}
        className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Start Exam
      </button>
    </div>
  );
}