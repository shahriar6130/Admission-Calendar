import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, FileText, Info, Edit, Trash2 } from 'lucide-react';
import { AdmissionEvent } from '../types';

interface EventCardProps {
  event: AdmissionEvent;
  onDelete?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDelete }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Admission': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Exam': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Result': return 'bg-green-100 text-green-800 border-green-200';
      case 'Admit Card': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)}`}>
          {event.category}
        </span>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/edit/${event.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded">
            <Edit size={16} />
          </Link>
          <button
            onClick={() => onDelete && onDelete(event.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
        <Link to={`/event/${event.id}`} className="hover:text-indigo-600">{event.title}</Link>
      </h3>

      <div className="flex items-center text-slate-500 text-sm mb-3">
        <Calendar size={14} className="mr-2" />
        {formattedDate}
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        <span className="font-semibold">Eligibility:</span> {event.eligibility}
      </p>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <a
          href={event.websiteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg text-xs font-medium transition-colors"
        >
          <ExternalLink size={14} />
          <span>Website</span>
        </a>
        <a
          href={event.admitCardLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-xs font-medium transition-colors ${
            event.admitCardLink
              ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
              : 'bg-slate-50 text-slate-300 cursor-not-allowed'
          }`}
          onClick={(e) => !event.admitCardLink && e.preventDefault()}
        >
          <FileText size={14} />
          <span>Admit Card</span>
        </a>
      </div>

      <Link
        to={`/event/${event.id}`}
        className="block text-center mt-4 text-xs text-indigo-600 hover:underline font-medium"
      >
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
