import React, { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import Input from './Input';
import Button from './Button';
import ResultDisplay from './ResultDisplay';
import InfoBox from './InfoBox';

interface CourseGradeCalculatorProps {
  onCalculate: (type: string, result: number) => void;
}

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const CourseGradeCalculator: React.FC<CourseGradeCalculatorProps> = ({ onCalculate }) => {
    const [exam1, setExam1] = useState('');
    const [exam2, setExam2] = useState('');
    const [perf1, setPerf1] = useState('');
    const [perf2, setPerf2] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ exam1?: string; exam2?: string; perf1?: string; perf2?: string; }>({});
    
    const validate = () => {
        const newErrors: typeof errors = {};
        const exam1Num = parseFloat(exam1);
        const exam2Num = parseFloat(exam2);
        const perf1Num = parseFloat(perf1);
        const perf2Num = parseFloat(perf2);

        if (exam1.trim() === '' || isNaN(exam1Num)) newErrors.exam1 = "Lütfen geçerli bir sayı girin.";
        else if (exam1Num < 0 || exam1Num > 100) newErrors.exam1 = "Not 0 ile 100 arasında olmalıdır.";
        
        if (exam2.trim() === '' || isNaN(exam2Num)) newErrors.exam2 = "Lütfen geçerli bir sayı girin.";
        else if (exam2Num < 0 || exam2Num > 100) newErrors.exam2 = "Not 0 ile 100 arasında olmalıdır.";
        
        if (perf1.trim() === '' || isNaN(perf1Num)) newErrors.perf1 = "Lütfen geçerli bir sayı girin.";
        else if (perf1Num < 0 || perf1Num > 100) newErrors.perf1 = "Not 0 ile 100 arasında olmalıdır.";
        
        if (perf2.trim() === '' || isNaN(perf2Num)) newErrors.perf2 = "Lütfen geçerli bir sayı girin.";
        else if (perf2Num < 0 || perf2Num > 100) newErrors.perf2 = "Not 0 ile 100 arasında olmalıdır.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculate = () => {
        if (!validate()) {
            setResult(null);
            return;
        }

        const exam1Num = parseFloat(exam1);
        const exam2Num = parseFloat(exam2);
        const perf1Num = parseFloat(perf1);
        const perf2Num = parseFloat(perf2);

        const examAvg = (exam1Num + exam2Num) / 2;
        const perfAvg = (perf1Num + perf2Num) / 2;
        const calculatedResult = (examAvg * 0.7) + (perfAvg * 0.3);
        setResult(calculatedResult);
        onCalculate('Ders Notu', calculatedResult);
    };

    return (
        <div className="flex flex-col justify-center flex-grow p-4 sm:p-6 animate-fade-slide-up">
            <CalculatorCard 
              title="Ders Notu" 
              icon={<PencilIcon />}
              footer={<Button onClick={calculate} className="w-full">Hesapla</Button>}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="course-exam1" label="1. Yazılı Sınav" value={exam1} onChange={e => setExam1(e.target.value)} placeholder="örn: 80" error={errors.exam1} />
                    <Input id="course-exam2" label="2. Yazılı Sınav" value={exam2} onChange={e => setExam2(e.target.value)} placeholder="örn: 85" error={errors.exam2} />
                    <Input id="course-perf1" label="1. Performans Notu" value={perf1} onChange={e => setPerf1(e.target.value)} placeholder="örn: 90" error={errors.perf1} />
                    <Input id="course-perf2" label="2. Performans Notu" value={perf2} onChange={e => setPerf2(e.target.value)} placeholder="örn: 95" error={errors.perf2} />
                </div>
                <ResultDisplay result={result} label="Ders Ortalaması" />
            </CalculatorCard>
            <InfoBox />
        </div>
    );
};

export default CourseGradeCalculator;
