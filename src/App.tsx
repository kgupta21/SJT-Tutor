import React from 'react';
import { ExamProvider } from './context/ExamContext';
import { useExam } from './context/ExamContext';
import { Lobby } from './pages/Lobby';
import { Reading } from './pages/Reading';
import { Response } from './pages/Response';
import { Results } from './pages/Results';

function ExamContent() {
  const { state } = useExam();

  switch (state.currentPhase) {
    case 'lobby':
      return <Lobby />;
    case 'reading':
      return <Reading />;
    case 'response':
      return <Response />;
    case 'results':
      return <Results />;
    default:
      return <Lobby />;
  }
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExamProvider>
        <ExamContent />
      </ExamProvider>
    </div>
  );
}

export default App;