import React, { useState } from 'react';
import { Course } from '../types';
import CalculatorCard from './CalculatorCard';
import Input from './Input';
import Button from './Button';
import ResultDisplay from './ResultDisplay';
import InfoBox from './InfoBox';

interface EnglishCalculatorProps {
  onCalculate: (type: string, result: number, courses?: Course[]) => void;
}

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const EnglishCalculator: React.FC<EnglishCalculatorProps> = ({ onCalculate }) => {
  const [exam, setExam] = useState('');
  const [speaking, setSpeaking] = useState('');
  const [listening, setListening] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ exam?: string; speaking?: string; listening?: string }>({});

  const validate = () => {
    const newErrors: { exam?: string; speaking?: string; listening?: string } = {};
    const examNum = parseFloat(exam);
    const speakingNum = parseFloat(speaking);
    const listeningNum = parseFloat(listening);
    
    if (exam.trim() === '' || isNaN(examNum)) newErrors.exam = "Lütfen geçerli bir sayı girin.";
    else if (examNum < 0 || examNum > 100) newErrors.exam = "Not 0 ile 100 arasında olmalıdır.";
  
    if (speaking.trim() === '' || isNaN(speakingNum)) newErrors.speaking = "Lütfen geçerli bir sayı girin.";
    else if (speakingNum < 0 || speakingNum > 100) newErrors.speaking = "Not 0 ile 100 arasında olmalıdır.";
    
    if (listening.trim() === '' || isNaN(listeningNum)) newErrors.listening = "Lütfen geçerli bir sayı girin.";
    else if (listeningNum < 0 || listeningNum > 100) newErrors.listening = "Not 0 ile 100 arasında olmalıdır.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) {
      setResult(null);
      return;
    }

    const examNum = parseFloat(exam);
    const speakingNum = parseFloat(speaking);
    const listeningNum = parseFloat(listening);
    
    const calculatedResult = (examNum * 0.50) + (speakingNum * 0.25) + (listeningNum * 0.25);
    setResult(calculatedResult);
    onCalculate('İngilizce', calculatedResult);
  };

  return (
    <div className="flex flex-col justify-center flex-grow p-4 sm:p-6 animate-fade-slide-up">
        <CalculatorCard 
          title="İngilizce Notu" 
          icon={<GlobeIcon/>}
          footer={<Button onClick={calculate} className="w-full">Hesapla</Button>}
        >
          <div className="space-y-4">
              <Input id="eng-exam" label="Yazılı Sınav Notu" value={exam} onChange={e => setExam(e.target.value)} placeholder="örn: 85" min="0" max="100" error={errors.exam} />
              <Input id="eng-speaking" label="Konuşma Notu" value={speaking} onChange={e => setSpeaking(e.target.value)} placeholder="örn: 95" min="0" max="100" error={errors.speaking} />
              <Input id="eng-listening" label="Dinleme Notu" value={listening} onChange={e => setListening(e.target.value)} placeholder="örn: 90" min="0" max="100" error={errors.listening} />
          </div>
          <ResultDisplay result={result} label="İngilizce Ortalaması" />
        </CalculatorCard>
        <InfoBox />
    </div>
  );
};

export default EnglishCalculator;
