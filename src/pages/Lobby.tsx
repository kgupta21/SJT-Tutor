import React, { useEffect, useState, FormEvent } from 'react';
import { Stethoscope, RefreshCw, Key, X, SkipForward } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export function Lobby() {
  const { state, dispatch } = useExam();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isUsingCustomKey, setIsUsingCustomKey] = useState(false);

  useEffect(() => {
    if (state.showScenarioSuccess) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_SCENARIO_SUCCESS' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.showScenarioSuccess]);

  const handleServerGeneration = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/generate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Server generation failed');
      }
      
      const data = await response.json();
      dispatch({ type: 'SET_SCENARIO', scenario: data });
      return true;
    } catch (error) {
      console.error('Server generation failed:', error);
      return false;
    }
  };

  const handleDirectGeneration = async (customKey: string) => {
    try {
      const requestBody = {
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{
          role: "user",
          content: `Generate a medical ethics scenario for a Situational Judgment Test (SJT) with exactly 3 follow-up questions. The scenario should be realistic and challenging, focusing on healthcare professional decision-making.

Format the response EXACTLY as a JSON object with the following structure, ensuring valid JSON:
{
  "scenario": "detailed scenario text here",
  "questions": [
    "first question here",
    "second question here",
    "third question here"
  ]
}

Make the scenario detailed but concise, around 150-200 words. Ensure the response is properly formatted JSON without any special characters or line breaks in the strings.`
        }],
        temperature: 0.7
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SJT Test Simulator'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Direct generation failed');
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      const cleanContent = content
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\t/g, ' ')
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, '')
        .replace(/\\/g, '\\\\');
        
      const scenarioData = JSON.parse(cleanContent);
      dispatch({ type: 'SET_SCENARIO', scenario: scenarioData });
      return true;
    } catch (error) {
      console.error('Direct generation failed:', error);
      return false;
    }
  };

  const handleRandomizeScenario = async () => {
    dispatch({ type: 'START_SCENARIO_GENERATION' });
    
    try {
      let success = false;

      if (isUsingCustomKey && apiKey) {
        // Try with custom key first if available
        success = await handleDirectGeneration(apiKey);
      } else {
        // Try server generation first
        success = await handleServerGeneration();
        
        // If server fails and we're not already showing the modal
        if (!success && !showApiKeyModal) {
          setShowApiKeyModal(true);
          dispatch({ type: 'SCENARIO_GENERATION_ERROR' });
          return;
        }
      }

      if (success) {
        setShowApiKeyModal(false);
      } else {
        dispatch({ type: 'SCENARIO_GENERATION_ERROR' });
      }
    } catch (error) {
      console.error('Error generating scenario:', error);
      dispatch({ type: 'SCENARIO_GENERATION_ERROR' });
      if (!showApiKeyModal) {
        setShowApiKeyModal(true);
      }
    }
  };

  const handleApiKeySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (apiKey.trim()) {
      dispatch({ type: 'START_SCENARIO_GENERATION' });
      const success = await handleDirectGeneration(apiKey.trim());
      if (success) {
        setIsUsingCustomKey(true);
        setShowApiKeyModal(false);
      } else {
        dispatch({ type: 'SCENARIO_GENERATION_ERROR' });
      }
    }
  };

  const handleUseSampleScenario = () => {
    dispatch({ type: 'USE_SAMPLE_SCENARIO' });
    setShowApiKeyModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Enter OpenRouter API Key</h3>
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              The default API key isn't working. You can either:
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-2">1. Enter your own OpenRouter API key:</p>
                <form onSubmit={handleApiKeySubmit}>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    Use API Key
                  </button>
                </form>
                <p className="text-sm text-gray-500 mt-2">
                  Get your key at{' '}
                  <a 
                    href="https://openrouter.ai/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-2">2. Use a sample scenario instead:</p>
                <button
                  onClick={handleUseSampleScenario}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <SkipForward className="w-5 h-5" />
                  Use Sample Scenario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="flex gap-4">
          <button
            onClick={handleRandomizeScenario}
            disabled={state.isGeneratingScenario}
            className={`flex-1 bg-green-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 ${
              state.isGeneratingScenario ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-6 h-6 ${state.isGeneratingScenario ? 'animate-spin' : ''}`} />
            <span>{state.isGeneratingScenario ? 'Generating...' : 'Generate New Scenario'}</span>
          </button>

          <button
            onClick={handleUseSampleScenario}
            className="bg-gray-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SkipForward className="w-6 h-6" />
            <span>Use Sample</span>
          </button>
        </div>

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
