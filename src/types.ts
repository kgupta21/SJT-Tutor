export interface Scenario {
  scenario: string;
  questions: string[];
}

export interface ExamState {
  currentPhase: 'lobby' | 'reading' | 'response' | 'results';
  responses: string[];
  timeRemaining: number;
  scenario: Scenario | null;
  isGeneratingScenario: boolean;
  showScenarioSuccess: boolean;
}

export interface ExamContextType {
  state: ExamState;
  dispatch: React.Dispatch<ExamAction>;
}

export type ExamAction =
  | { type: 'START_EXAM' }
  | { type: 'START_RESPONSE' }
  | { type: 'UPDATE_RESPONSE'; index: number; value: string }
  | { type: 'SUBMIT_EXAM' }
  | { type: 'UPDATE_TIMER'; time: number }
  | { type: 'START_SCENARIO_GENERATION' }
  | { type: 'SET_SCENARIO'; scenario: Scenario }
  | { type: 'SCENARIO_GENERATION_ERROR' }
  | { type: 'HIDE_SCENARIO_SUCCESS' }
  | { type: 'RESET_EXAM' }
  | { type: 'USE_SAMPLE_SCENARIO' };
