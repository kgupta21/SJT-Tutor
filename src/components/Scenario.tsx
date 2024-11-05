import React from 'react';

const scenarioText = `You are a medical resident working in the emergency department. During your shift, you notice that a colleague appears to be under the influence of alcohol. This colleague is scheduled to perform a critical procedure in the next hour. The attending physician is currently unavailable, and you are the senior resident on duty.

Consider the ethical implications, patient safety concerns, and professional obligations in this situation.`;

export function Scenario() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Scenario 1</h2>
      <p className="text-gray-700 leading-relaxed">{scenarioText}</p>
    </div>
  );
}