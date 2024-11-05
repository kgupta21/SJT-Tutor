import React, { createContext, useContext, useReducer } from 'react';
import { ExamState, ExamAction, ExamContextType, Scenario } from '../types';

const sampleScenario: Scenario = {
  scenario: "Dr. Sarah Chen is a first-year resident working in the Emergency Department when a 45-year-old patient, Mr. Johnson, arrives with severe chest pain. Initial tests suggest a possible heart attack, requiring immediate intervention. However, Mr. Johnson refuses treatment, stating he's a practicing Jehovah's Witness and his religious beliefs prohibit certain medical procedures, including blood transfusions. His condition is rapidly deteriorating, and his wife, who is not of the same faith, is urging the medical team to intervene against his wishes. Dr. Chen knows that without immediate treatment, the patient's chances of survival decrease significantly.",
  questions: [
    "How should Dr. Chen balance the patient's religious beliefs with her medical obligation to provide life-saving care?",
    "What immediate steps should Dr. Chen take to manage this situation while respecting both the patient's autonomy and his wife's concerns?",
    "How should Dr. Chen document and communicate this situation to protect both the patient's rights and her professional obligations?"
  ]
};

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
    case 'USE_SAMPLE_SCENARIO':
      return {
        ...state,
        scenario: sampleScenario,
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
