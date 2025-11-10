import React, { useState } from 'react';
import { Course } from '../types';
import CalculatorCard from './CalculatorCard';
import Input from './Input';
import Button from './Button';
import ResultDisplay from './ResultDisplay';
import InfoBox from './InfoBox';

interface LiteratureCalculatorProps {
  onCalculate: (type: string, result: number, courses?: Course[]) => void;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);


const LiteratureCalculator: React.FC<LiteratureCalculatorProps> = ({ onCalculate }) => {
  const [exam, setExam] = useState('');
  const [listening, setListening] = useState('');
  const [speaking, setSpeaking] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ exam?: string; listening?: string; speaking?: string }>({});

  const validate = () => {
    const newErrors: { exam?: string; listening?: string; speaking?: string } = {};
    const examNum = parseFloat(exam);
    const listeningNum = parseFloat(listening);
    const speakingNum = parseFloat(speaking);

    if (exam.trim() === '' || isNaN(examNum)) newErrors.exam = "Lütfen geçerli bir sayı girin.";
    else if (examNum < 0 || examNum > 100) newErrors.exam = "Not 0 ile 100 arasında olmalıdır.";
  
    if (listening.trim() === '' || isNaN(listeningNum)) newErrors.listening = "Lütfen geçerli bir sayı girin.";
    else if (listeningNum < 0 || listeningNum > 100) newErrors.listening = "Not 0 ile 100 arasında olmalıdır.";
  
    if (speaking.trim() === '' || isNaN(speakingNum)) newErrors.speaking = "Lütfen geçerli bir sayı girin.";
    else if (speakingNum < 0 || speakingNum > 100) newErrors.speaking = "Not 0 ile 100 arasında olmalıdır.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) {
      setResult(null);
      return;
    }

    const examNum = parseFloat(exam);
    const listeningNum = parseFloat(listening);
    const speakingNum = parseFloat(speaking);

    const calculatedResult = (examNum * 0.70) + (listeningNum * 0.15) + (speakingNum * 0.15);
    setResult(calculatedResult);
    onCalculate('Edebiyat', calculatedResult);
  };

  return (
    <div className="flex flex-col justify-center flex-grow p-4 sm:p-6 animate-fade-slide-up">
        <CalculatorCard 
          title="Edebiyat Notu" 
          icon={<BookIcon />}
          footer={<Button onClick={calculate} className="w-full">Hesapla</Button>}
        >
          <div className="space-y-4">
              <Input id="lit-exam" label="Yazılı Sınav Notu" value={exam} onChange={e => setExam(e.target.value)} placeholder="örn: 85" min="0" max="100" error={errors.exam} />
              <Input id="lit-listening" label="Dinleme Notu" value={listening} onChange={e => setListening(e.target.value)} placeholder="örn: 90" min="0" max="100" error={errors.listening} />
              <Input id="lit-speaking" label="Konuşma Notu" value={speaking} onChange={e => setSpeaking(e.target.value)} placeholder="örn: 95" min="0" max="100" error={errors.speaking} />
          </div>
          <ResultDisplay result={result} label="Edebiyat Ortalaması" />
        </CalculatorCard>
        <InfoBox />
    </div>
  );
};

export default LiteratureCalculator;
