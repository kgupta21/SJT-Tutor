import React, { useEffect } from 'react';
import { Stethoscope, RefreshCw } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export function Lobby() {
  const { state, dispatch } = useExam();

  useEffect(() => {
    if (state.showScenarioSuccess) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_SCENARIO_SUCCESS' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.showScenarioSuccess]);

  const getApiUrl = () => {
    // Check if we're in production (Netlify)
    if (window.location.hostname !== 'localhost') {
      return 'https://tutorsjt.netlify.app/api/generate-scenario';
    }
    // Local development
    return 'http://localhost:3001/api/generate-scenario';
  };

  const handleRandomizeScenario = async () => {
    try {
      dispatch({ type: 'START_SCENARIO_GENERATION' });
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('API Response Status:', response.status);
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error('Failed to generate scenario');
      }
      
      const data = await response.json();
      console.log('Received scenario:', data);
      dispatch({ type: 'SET_SCENARIO', scenario: data });
    } catch (error) {
      console.error('Error generating scenario:', error);
      dispatch({ type: 'SCENARIO_GENERATION_ERROR' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {state.showScenarioSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          New scenario ready!
        </div>
      )}
      
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Stethoscope className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SJT Test Simulator
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

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleRandomizeScenario}
          disabled={state.isGeneratingScenario}
          className={`w-full bg-green-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 ${
            state.isGeneratingScenario ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-6 h-6 ${state.isGeneratingScenario ? 'animate-spin' : ''}`} />
          <span>{state.isGeneratingScenario ? 'Generating...' : 'Randomize Scenario'}</span>
        </button>

        <button
          onClick={() => dispatch({ type: 'START_EXAM' })}
          disabled={!state.scenario}
          className={`w-full bg-blue-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors ${
            !state.scenario ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}
