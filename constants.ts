
import { Category } from './types';

//admission events
export const STORAGE_KEY = 'adm_events';

export const CATEGORIES: Category[] = ['Admission', 'Exam', 'Result', 'Admit Card', 'Other'];

export const MONTHS = [
  { value: 'all', label: 'All Months' },
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export const DEMO_DATA = [
  {
    id: '1',
    title: 'Dhaka University Admission 2025',
    date: '2025-05-15',
    category: 'Admission',
    eligibility: 'HSC Passed with GPA 8.00 (Combined)',
    websiteLink: 'https://admission.eis.du.ac.bd/',
    admitCardLink: 'https://admission.eis.du.ac.bd/login',
    notes: 'Unit A and Unit B dates are slightly different.',
    createdAt: new Date().toISOString()
  }
];
