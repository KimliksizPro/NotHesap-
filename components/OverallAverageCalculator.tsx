import React, { useState, useEffect } from 'react';
import { Course, CertificateStatus } from '../types';
import CalculatorCard from './CalculatorCard';
import Button from './Button';
import ResultDisplay from './ResultDisplay';

interface OverallAverageCalculatorProps {
  onCalculate: (type: string, result: number, courses?: Course[]) => void;
  initialCourses?: Course[] | null;
  onRestored?: () => void;
}

const ChartPieIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


const OverallAverageCalculator: React.FC<OverallAverageCalculatorProps> = ({ onCalculate, initialCourses, onRestored }) => {
  const [courses, setCourses] = useState<Course[]>([{ id: 1, name: '', weight: '', grade: '' }]);
  const [result, setResult] = useState<number | null>(null);
  const [certificateStatus, setCertificateStatus] = useState<CertificateStatus>(null);
  const [errors, setErrors] = useState<{ [id: number]: { name?: string; weight?: string; grade?: string } }>({});

  useEffect(() => {
    if (initialCourses && onRestored) {
        setCourses(initialCourses);
        setResult(null);
        setCertificateStatus(null);
        setErrors({});
        onRestored();
    }
  }, [initialCourses, onRestored]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', weight: '', grade: '' }]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const handleCourseChange = (id: number, field: keyof Omit<Course, 'id'>, value: string) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ));
    setResult(null);
    setCertificateStatus(null);
  };

  const validate = () => {
    const newErrors: { [id: number]: { name?: string; weight?: string; grade?: string } } = {};
    let isValid = true;

    courses.forEach(course => {
        const courseErrors: { name?: string; weight?: string; grade?: string } = {};
        if (course.name.trim() === '') {
            courseErrors.name = "Ders adı boş olamaz.";
            isValid = false;
        }

        const weight = parseFloat(course.weight);
        if (course.weight.trim() === '' || isNaN(weight)) {
            courseErrors.weight = "Geçerli bir sayı girin.";
            isValid = false;
        } else if (weight <= 0) {
            courseErrors.weight = "Ağırlık > 0 olmalıdır.";
            isValid = false;
        }

        const grade = parseFloat(course.grade);
        if (course.grade.trim() === '' || isNaN(grade)) {
            courseErrors.grade = "Geçerli bir sayı girin.";
            isValid = false;
        } else if (grade < 0 || grade > 100) {
            courseErrors.grade = "Not 0-100 arasında olmalıdır.";
            isValid = false;
        }
        
        if (Object.keys(courseErrors).length > 0) {
            newErrors[course.id] = courseErrors;
        }
    });

    setErrors(newErrors);
    return isValid;
  }
  
  const calculate = () => {
    if (!validate()) {
        setResult(null);
        setCertificateStatus(null);
        return;
    }
    
    let totalWeightedGrade = 0;
    let totalWeight = 0;

    for (const course of courses) {
      const grade = parseFloat(course.grade);
      const weight = parseFloat(course.weight);
      totalWeightedGrade += grade * weight;
      totalWeight += weight;
    }

    const calculatedResult = totalWeightedGrade / totalWeight;
    setResult(calculatedResult);
    onCalculate('Genel Ortalama', calculatedResult, courses);

    // Calculate certificate status
    const hasLowGrade = courses.some(c => parseFloat(c.grade) < 50);

    if (hasLowGrade) {
        setCertificateStatus('low_grade');
    } else if (calculatedResult >= 85) {
        setCertificateStatus('takdir');
    } else if (calculatedResult >= 70) {
        setCertificateStatus('tesekkur');
    } else {
        setCertificateStatus('low_average');
    }
  };


  return (
    <div className="p-4 sm:p-6 animate-fade-slide-up">
        <CalculatorCard 
          title="Genel Ortalama" 
          icon={<ChartPieIcon />}
          footer={
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={addCourse} variant="secondary" icon={<PlusIcon />} className="w-full">Ders Ekle</Button>
                <Button onClick={calculate} className="w-full">Genel Ortalamayı Hesapla</Button>
            </div>
          }
        >
          <div className="space-y-4">
              {courses.map((course) => (
              <div key={course.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-8 gap-x-2 gap-y-3 items-start">
                  <div className="sm:col-span-3">
                      <label htmlFor={`name-${course.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Ders Adı</label>
                      <input id={`name-${course.id}`} type="text" value={course.name} onChange={e => handleCourseChange(course.id, 'name', e.target.value)} placeholder="örn: Matematik" className={`w-full text-sm p-2 border-b bg-transparent ${errors[course.id]?.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-500'} focus:outline-none focus:border-blue-500`} />
                      {errors[course.id]?.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[course.id].name}</p>}
                  </div>
                  <div className="sm:col-span-2">
                      <label htmlFor={`weight-${course.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Ağırlık</label>
                      <input id={`weight-${course.id}`} type="number" value={course.weight} onChange={e => handleCourseChange(course.id, 'weight', e.target.value)} placeholder="örn: 4" className={`w-full text-sm p-2 border-b bg-transparent ${errors[course.id]?.weight ? 'border-red-500' : 'border-slate-300 dark:border-slate-500'} focus:outline-none focus:border-blue-500`} />
                      {errors[course.id]?.weight && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[course.id].weight}</p>}
                  </div>
                  <div className="sm:col-span-2">
                      <label htmlFor={`grade-${course.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Not</label>
                      <input id={`grade-${course.id}`} type="number" value={course.grade} onChange={e => handleCourseChange(course.id, 'grade', e.target.value)} placeholder="örn: 90" min="0" max="100" className={`w-full text-sm p-2 border-b bg-transparent ${errors[course.id]?.grade ? 'border-red-500' : 'border-slate-300 dark:border-slate-500'} focus:outline-none focus:border-blue-500`} />
                      {errors[course.id]?.grade && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[course.id].grade}</p>}
                  </div>
                  <div className="sm:col-span-1 self-end">
                      {courses.length > 1 && (
                      <button onClick={() => removeCourse(course.id)} className="w-full h-[36px] mt-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors flex justify-center items-center">
                          <TrashIcon />
                      </button>
                      )}
                  </div>
                  </div>
              </div>
              ))}
          </div>
          <ResultDisplay result={result} label="Genel Ortalama" certificateStatus={certificateStatus} />
        </CalculatorCard>
    </div>
  );
};

export default OverallAverageCalculator;
