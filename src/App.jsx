import { useState } from 'react';
import Header from './components/Header';
import Quiz from './components/Quiz';
import TrueFalseGame from './components/trueFalse/TrueFalseGame';
import ConnectionsGame from './components/connections/ConnectionsGame';
import ConceptClues from './components/clues/ConceptClues';
import EstimationGame from './components/estimate/EstimationGame';
import DebugBar from './components/DebugBar';
import Welcome from './components/Welcome';
import { getDailyContent } from './utils/dailyQuiz';
import { getEffectiveDate, isDebugMode } from './utils/debugDate';
import { isFirstVisit } from './utils/storage';

const date = getEffectiveDate();
const day = getDailyContent(date);
const format = day.format;
const debug = isDebugMode();

function getGameComponent(day, date) {
  switch (day.format) {
    case 'mc':
      return <Quiz questions={day.questions} date={date} />;
    case 'tf':
      return <TrueFalseGame statements={day.statements} date={date} />;
    case 'connections':
      return <ConnectionsGame puzzle={{ groups: day.groups }} date={date} />;
    case 'clues':
      return <ConceptClues day={day} date={date} />;
    case 'estimate':
      return <EstimationGame day={day} date={date} />;
    default:
      return <Quiz questions={day.questions} date={date} />;
  }
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(isFirstVisit());

  if (showWelcome && !debug) {
    return <Welcome onDismiss={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {debug && <DebugBar date={date} format={format} />}
      <Header date={date} format={format} />
      <main className="flex-1 pb-8">
        {getGameComponent(day, date)}
      </main>
    </div>
  );
}
