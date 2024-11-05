import React, { createContext, useContext, useReducer } from 'react';
import { ExamState, ExamAction, ExamContextType, Scenario } from '../types';

const initialState: ExamState = {
  currentPhase: 'lobby',
  responses: ['', '', ''],
  timeRemaining: 0,
  scenario: null,
  isGeneratingScenario: false,
  showScenarioSuccess: false,
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'START_EXAM':
      return { ...state, currentPhase: 'reading', timeRemaining: 30 };
    case 'START_RESPONSE':
      return { ...state, currentPhase: 'response', timeRemaining: 300 };
    case 'UPDATE_RESPONSE':
      const newResponses = [...state.responses];
      newResponses[action.index] = action.value;
      return { ...state, responses: newResponses };
    case 'SUBMIT_EXAM':
      return { ...state, currentPhase: 'results' };
    case 'UPDATE_TIMER':
      return { ...state, timeRemaining: action.time };
    case 'START_SCENARIO_GENERATION':
      return { ...state, isGeneratingScenario: true, showScenarioSuccess: false };
    case 'SET_SCENARIO':
      return {
        ...state,
        scenario: action.scenario,
        isGeneratingScenario: false,
        showScenarioSuccess: true,
      };
    case 'SCENARIO_GENERATION_ERROR':
      return { ...state, isGeneratingScenario: false };
    case 'HIDE_SCENARIO_SUCCESS':
      return { ...state, showScenarioSuccess: false };
    case 'RESET_EXAM':
      return {
        ...initialState,
        responses: ['', '', '']
      };
    default:
      return state;
  }
}

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(examReducer, initialState);

  return (
    <ExamContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}
