import { useState } from 'react';

// Cat as a Service — https://cataas.com
// Returns a random cat image sized to 400x400.
export default function CatReward() {
  const [status, setStatus] = useState('loading'); // loading | loaded | failed

  // Lock the URL at mount so re-renders don't swap cats mid-view.
  const [url] = useState(
    () => `https://cataas.com/cat?width=400&height=400&t=${Date.now()}`
  );

  return (
    <div className="my-6 flex flex-col items-center animate-fade-in">
      <p className="text-xs text-brand-200/60 mb-3 uppercase tracking-wider font-medium">
        You earned a cat
      </p>
      <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-brand-200/5 border-2 border-brand-300/20 flex items-center justify-center">
        {status !== 'loaded' && (
          <span className={`text-5xl ${status === 'loading' ? 'opacity-40 animate-pulse' : 'opacity-80'}`}>
            🐱
          </span>
        )}
        {status !== 'failed' && (
          <img
            src={url}
            alt="A reward cat, courtesy of Cat as a Service"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('failed')}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>
    </div>
  );
}
