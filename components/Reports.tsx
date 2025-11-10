import React from 'react';
import { Calculation } from '../types';

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const StatCard: React.FC<{title: string, value: string}> = ({title, value}) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center border border-slate-200 dark:border-slate-700">
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">{value}</p>
  </div>
);

const LineChart: React.FC<{data: Calculation[]}> = ({ data }) => {
    const chartHeight = 150;
    const chartWidth = 350;
    const padding = { top: 10, right: 10, bottom: 0, left: 25 };

    const dataPoints = data;
    const dataLength = dataPoints.length;

    const getX = (index: number) => {
        if (dataLength <= 1) return padding.left + (chartWidth - padding.left - padding.right) / 2;
        return padding.left + (index / (dataLength - 1)) * (chartWidth - padding.left - padding.right);
    }
    const getY = (value: number) => chartHeight - padding.bottom - ((value / 100) * (chartHeight - padding.top - padding.bottom));

    const pathData = dataPoints.map((point, index) => {
        const x = getX(index);
        const y = getY(point.result);
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    const areaPathData = `${pathData} L ${getX(dataLength - 1).toFixed(2)},${(chartHeight - padding.bottom).toFixed(2)} L ${getX(0).toFixed(2)},${(chartHeight - padding.bottom).toFixed(2)} Z`;

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
            <title id="chart-title">Genel Ortalama Gelişim Grafiği</title>
            {/* Y Axis Lines and Labels */}
            {[0, 50, 100].map((label) => {
                const y = getY(label);
                return (
                    <g key={label} className="text-xs text-slate-400 dark:text-slate-500">
                        <line
                            x1={padding.left}
                            y1={y}
                            x2={chartWidth}
                            y2={y}
                            stroke="currentColor"
                            strokeDasharray="2,2"
                            className="opacity-70"
                        />
                        <text x="0" y={y + 4} fill="currentColor" className="font-medium">{label}</text>
                    </g>
                );
            })}

            {/* Gradient under the line */}
            <defs>
                <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" className="text-primary-500" stopOpacity={0.4} />
                    <stop offset="100%" className="text-primary-500" stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={areaPathData} fill="url(#line-gradient)" />

            {/* Line path */}
            <path d={pathData} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-500" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Data point circles */}
            {dataPoints.map((point, index) => (
                <g key={point.id}>
                    <circle 
                        cx={getX(index)} 
                        cy={getY(point.result)} 
                        r="5" 
                        fill="currentColor" 
                        className="text-primary-500 opacity-0 hover:opacity-100 transition-opacity cursor-pointer" 
                    />
                    <circle 
                        cx={getX(index)} 
                        cy={getY(point.result)} 
                        r="3" 
                        fill="currentColor" 
                        className="text-white dark:text-slate-800" 
                    />
                     <circle 
                        cx={getX(index)} 
                        cy={getY(point.result)} 
                        r="2" 
                        fill="currentColor" 
                        className="text-primary-600 dark:text-primary-400" 
                    />
                    <title>{`Tarih: ${new Date(point.timestamp).toLocaleDateString('tr-TR')}\nSonuç: ${point.result.toFixed(2)}`}</title>
                </g>
            ))}
        </svg>
    );
};


interface ReportsProps {
    history: Calculation[];
}

const Reports: React.FC<ReportsProps> = ({ history }) => {
    const overallHistory = history
        .filter(calc => calc.type === 'Genel Ortalama')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const getAverageByType = (type: string) => {
        const calcs = history.filter(c => c.type === type);
        if (calcs.length === 0) return null;
        const sum = calcs.reduce((acc, curr) => acc + curr.result, 0);
        return sum / calcs.length;
    };

    const edebiyatAvg = getAverageByType('Edebiyat');
    const ingilizceAvg = getAverageByType('İngilizce');
    const dersNotuAvg = getAverageByType('Ders Notu');
    const highestOverall = overallHistory.length > 0 ? Math.max(...overallHistory.map(c => c.result)) : null;

    if (history.length < 2) {
        return (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8 px-4">
                <ChartBarIcon />
                <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">Raporlar için Yetersiz Veri</p>
                <p className="text-sm mt-1">Akademik ilerlemenizi görmek için lütfen birkaç hesaplama daha yapın.</p>
            </div>
        );
    }

    const hasStats = highestOverall || edebiyatAvg || ingilizceAvg || dersNotuAvg;

    return (
        <div className="space-y-6">
            {overallHistory.length > 1 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Genel Ortalama Gelişimi</h3>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <LineChart data={overallHistory} />
                    </div>
                </div>
            )}

            {hasStats && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Özet İstatistikler</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {highestOverall && <StatCard title="En Yüksek Genel" value={highestOverall.toFixed(2)} />}
                        {edebiyatAvg && <StatCard title="Edebiyat Ort." value={edebiyatAvg.toFixed(2)} />}
                        {ingilizceAvg && <StatCard title="İngilizce Ort." value={ingilizceAvg.toFixed(2)} />}
                        {dersNotuAvg && <StatCard title="Ders Notu Ort." value={dersNotuAvg.toFixed(2)} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;