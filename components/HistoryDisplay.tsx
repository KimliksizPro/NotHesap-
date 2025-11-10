import React from 'react';
import { Calculation, Course } from '../types';
import Button from './Button';

interface HistoryDisplayProps {
  history: Calculation[];
  onClear: () => void;
  onRestore: (calculation: Calculation) => void;
  onRemove: (id: string) => void;
  onImport: (calculations: Calculation[]) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const ReplayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onClear, onRestore, onRemove, onImport }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          throw new Error("CSV dosyası boş veya sadece başlık satırı içeriyor.");
        }
        
        lines.shift(); // Başlık satırını kaldır

        const importedCalculations: Calculation[] = [];

        for (const line of lines) {
          // Split by comma, but ignore commas inside double quotes
          const values = line.trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, ''));
          
          if (values.length < 5) continue; 

          const [id, type, resultStr, timestampStr, coursesStr] = values;
          
          const result = parseFloat(resultStr);

          const [datePart, timePart] = timestampStr.split(' ');
          if (!datePart || !timePart) continue;

          const [day, month, year] = datePart.split('.').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
          const date = new Date(year, month - 1, day, hour, minute, second);
          const timestamp = date.toISOString();

          let courses: Course[] | undefined = undefined;
          if (coursesStr && coursesStr.trim() !== '') {
            courses = coursesStr.split(';').map((courseStr, index) => {
              const trimmedCourseStr = courseStr.trim();
              if (trimmedCourseStr === '') return null;

              const match = trimmedCourseStr.match(/(.+) \(Ağırlık:\s*(.+),\s*Not:\s*(.+)\)/);
              if (match) {
                return {
                  id: Date.now() + index,
                  name: match[1].trim(),
                  weight: match[2].trim(),
                  grade: match[3].trim(),
                };
              }
              return null;
            }).filter((c): c is Course => c !== null);
          }
          
          if (!isNaN(result) && id && type && timestamp) {
            importedCalculations.push({ id, type, result, timestamp, courses });
          }
        }
        
        onImport(importedCalculations.reverse());
        alert("Geçmiş başarıyla içe aktarıldı!");
      } catch (error) {
        console.error("CSV dosyası okunurken hata oluştu:", error);
        alert("CSV dosyası içe aktarılırken bir hata oluştu. Lütfen dosya formatını kontrol edin.");
      } finally {
        if(event.target) {
          event.target.value = '';
        }
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleExport = () => {
    if (history.length === 0) return;

    const headers = ['ID', 'Tür', 'Sonuç', 'Tarih', 'Dersler'];
    
    const reversedHistory = [...history].reverse();

    const csvRows = [headers.join(',')];

    reversedHistory.forEach(item => {
      const coursesString = item.courses
        ? item.courses.map(c => `${c.name} (Ağırlık: ${c.weight}, Not: ${c.grade})`).join('; ')
        : '';
        
      const row = [
        `"${item.id}"`,
        `"${item.type}"`,
        `"${item.result.toFixed(2)}"`,
        `"${new Date(item.timestamp).toLocaleString('tr-TR')}"`,
        `"${coursesString}"`
      ].join(',');
      
      csvRows.push(row);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([`\ufeff${csvString}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'hesaplama_gecmisi.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-4 gap-2">
        {history.length > 0 && (
          <>
            <Button onClick={handleExport} variant="secondary" className="!py-2 !px-3" icon={<DownloadIcon />}>
              <span className="hidden sm:inline">Dışa Aktar</span>
            </Button>
            <Button onClick={onClear} variant="danger" className="!py-2 !px-3" icon={<TrashIcon />}>
               <span className="hidden sm:inline">Temizle</span>
            </Button>
          </>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center text-slate-500 dark:text-slate-400 py-8 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">Geçmişiniz Henüz Boş</p>
            <p className="text-sm mt-1">Yaptığınız hesaplamalar burada görünecek.</p>
            <label htmlFor="csv-import-input" className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-200 px-4 py-2 font-bold text-slate-800 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-300 active:scale-95 focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 focus-within:ring-offset-white dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500 dark:focus-within:ring-offset-slate-800">
                <span className="mr-2"><UploadIcon /></span>
                Geçmişi İçe Aktar
            </label>
            <input id="csv-import-input" type="file" onChange={handleFileChange} accept=".csv,text/csv" className="hidden" />
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li key={item.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex flex-col border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{item.type}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(item.timestamp).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {item.result.toFixed(1)}
                    </p>
                    {item.type === 'Genel Ortalama' && item.courses && item.courses.length > 0 && (
                        <button
                            onClick={() => onRestore(item)}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            aria-label="Bu hesaplamayı yeniden hesapla"
                            title="Yeniden Hesapla"
                        >
                            <ReplayIcon />
                        </button>
                    )}
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Bu hesaplamayı sil"
                        title="Sil"
                    >
                        <TrashIcon />
                    </button>
                </div>
              </div>
              {item.courses && item.courses.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 w-full text-xs">
                  <ul className="space-y-1.5">
                    {item.courses.map(course => (
                      <li key={course.id} className="grid grid-cols-3 gap-2 text-slate-600 dark:text-slate-400">
                        <span className="truncate col-span-1 font-medium">{course.name}</span>
                        <span className="text-center">Ağırlık: {course.weight}</span>
                        <span className="text-right">Not: {course.grade}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryDisplay;