import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceControl = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice recognition is not supported by your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Voice recognition error.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      toast(`Heard: "${transcript}"`);
      onCommand(transcript);
    };

    recognitionRef.current = recognition;
  }, [onCommand]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <button
      onClick={toggleListen}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-full text-white shadow-lg transition-colors ${
        isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
      }`}
      title="Toggle Voice Command"
    >
      {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
    </button>
  );
};

export default VoiceControl;