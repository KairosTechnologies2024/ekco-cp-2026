import React, { useEffect, useState } from 'react';
import './SplashScreen.scss'; // Reuse styles

interface GreetingSplashProps {
  name: string;
  date: string;
  onComplete: () => void;
}

const GreetingSplash: React.FC<GreetingSplashProps> = ({ name, date, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  // read greeting emoji from localStorage (set by SettingsModal); default to a friendly wave
  const greetingEmoji = typeof window !== 'undefined' ? (localStorage.getItem('greetingEmoji') || '👋') : '👋';
  const fullText = `Hi, ${name} ${greetingEmoji}`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 2000); 
      }
    }, 100); 
    return () => clearInterval(interval);
  }, [fullText, date, onComplete]);

  return (
    <div className="splash-container">
      <div className="splash-logo">{displayedText}</div>
    </div>
  );
};

export default GreetingSplash;
