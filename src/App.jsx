import React, { useState } from 'react';
import InputArea from './components/InputArea';
import OutputPreview from './components/OutputPreview';
import './styles.css';

function App() {
  const [text, setText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleGenerate = () => {
    if (text.trim()) {
      setShowPreview(true);
    }
  };

  return (
    <div className="container">
      <h1>Assistant de Rédaction Médicale</h1>
      <InputArea 
        onTextChange={handleTextChange}
        onGenerate={handleGenerate}
      />
      {showPreview && <OutputPreview markdown={text} />}
    </div>
  );
}

export default App; 