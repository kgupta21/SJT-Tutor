export interface ExamState {
  currentPhase: 'lobby' | 'reading' | 'response' | 'results';
  responses: string[];
  timeRemaining: number;
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
  | { type: 'UPDATE_TIMER'; time: number };