import React from 'react';
import { Course } from '../types';

interface GradeChartProps {
  courses: Course[];
}

const GradeChart: React.FC<GradeChartProps> = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return null;
  }

  const chartHeight = 200;
  const chartWidth = 350; // Will be responsive with viewBox
  const barPadding = 10;
  
  const validCourses = courses.filter(c => c.grade && !isNaN(parseFloat(c.grade)) && c.name.trim() !== '');
  
  if (validCourses.length === 0) {
      return null;
  }
  
  const barWidth = (chartWidth - barPadding * (validCourses.length + 1)) / validCourses.length;
  const maxGrade = 100;

  return (
    <div className="mt-6 animate-fade-slide-up">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Not Dağılım Grafiği</h3>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
                <title id="chart-title">Ders Notları Grafiği</title>
                {/* Y Axis Lines and Labels */}
                {[0, 25, 50, 75, 100].map((label) => {
                    const y = chartHeight - (label / maxGrade) * chartHeight;
                    return (
                        <g key={label} className="text-xs text-slate-400 dark:text-slate-500">
                            <line
                                x1="25"
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

                {/* Bars and X Axis Labels */}
                {validCourses.map((course, index) => {
                    const grade = parseFloat(course.grade);
                    const barHeight = Math.max((grade / maxGrade) * chartHeight, 1); // min height of 1px
                    const x = 28 + barPadding + index * (barWidth + barPadding);
                    const y = chartHeight - barHeight;

                    return (
                        <g key={course.id}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx="2"
                                className="fill-primary-500 hover:fill-primary-600 dark:fill-primary-500 dark:hover:fill-primary-400 transition-colors"
                            >
                                <title>{`${course.name}: ${grade.toFixed(1)}`}</title>
                            </rect>
                            <text
                                x={x + barWidth / 2}
                                y={chartHeight + 15}
                                textAnchor="middle"
                                className="text-[10px] font-semibold fill-slate-600 dark:fill-slate-300 truncate"
                            >
                                {course.name}
                            </text>
                             <text
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                                className="text-xs font-bold fill-slate-700 dark:fill-slate-200"
                            >
                                {grade.toFixed(0)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    </div>
  );
};

export default GradeChart;