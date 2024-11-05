import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export function Timer() {
  const { state, dispatch } = useExam();

  useEffect(() => {
    if (state.timeRemaining <= 0) {
      if (state.currentPhase === 'reading') {
        dispatch({ type: 'START_RESPONSE' });
      } else if (state.currentPhase === 'response') {
        dispatch({ type: 'SUBMIT_EXAM' });
      }
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: 'UPDATE_TIMER', time: state.timeRemaining - 1 });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeRemaining, state.currentPhase]);

  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = state.timeRemaining % 60;

  return (
    <div className="flex items-center gap-2 text-xl font-semibold">
      <Clock className="w-6 h-6" />
      <span>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}