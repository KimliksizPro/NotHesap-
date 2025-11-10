export type Tab = 'literature' | 'english' | 'overall' | 'course' | 'more';

export interface Calculation {
  id: string;
  type: string;
  result: number;
  timestamp: string;
  courses?: Course[];
}

export interface Course {
  id: number;
  name: string;
  weight: string;
  grade: string;
}

export type CertificateStatus = 'takdir' | 'tesekkur' | 'low_grade' | 'low_average' | null;