import React from 'react';
import type { Book } from './booksData';
import { Tag, Calendar, User, CheckCircle2, BookOpen, Clock } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

// Helper to assign colors based on category
const getCategoryColor = (category: string) => {
  switch (category) {
    case '小说': return 'bg-blue-500';
    case '科技': return 'bg-cyan-500';
    case '历史': return 'bg-amber-600';
    case '经管': return 'bg-emerald-500';
    case '哲学': return 'bg-violet-500';
    case '心理': return 'bg-rose-500';
    case '传记': return 'bg-teal-600';
    default: return 'bg-slate-500';
  }
};

const getCategoryBadgeStyle = (category: string) => {
   switch (category) {
    case '小说': return 'text-blue-700 bg-blue-50 border-blue-200';
    case '科技': return 'text-cyan-700 bg-cyan-50 border-cyan-200';
    case '历史': return 'text-amber-700 bg-amber-50 border-amber-200';
    case '经管': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case '哲学': return 'text-violet-700 bg-violet-50 border-violet-200';
    case '心理': return 'text-rose-700 bg-rose-50 border-rose-200';
    case '传记': return 'text-teal-700 bg-teal-50 border-teal-200';
    default: return 'text-slate-700 bg-slate-50 border-slate-200';
  }
}

// Helper for reading status
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'reading': 
      return { icon: BookOpen, label: '在读', style: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
    case 'toread': 
    case 'wishlist':
      return { icon: Clock, label: '想读', style: 'text-amber-600 bg-amber-50 border-amber-100' };
    case 'completed':
    default: 
      return { icon: CheckCircle2, label: '已读', style: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  }
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const accentColor = getCategoryColor(book.category);
  const badgeStyle = getCategoryBadgeStyle(book.category);
  const statusConfig = getStatusConfig(book.status);
  const StatusIcon = statusConfig.icon;

  return (
    // Removed overflow-hidden to allow tooltip to pop out
    <div className="group relative flex flex-col h-full bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 hover:-translate-y-1">
      {/* Colored Spine/Top Bar with manual rounded corners */}
      <div className={`h-2 w-full rounded-t-xl ${accentColor}`} />
      
      <div className="p-5 flex flex-col flex-grow">
        {/* Header: Category, Year, and Status */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col gap-1.5">
            <span className={`self-start px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${badgeStyle}`}>
              {book.category}
            </span>
            <div className="flex items-center text-slate-400 text-xs font-medium pl-0.5">
              <Calendar className="w-3 h-3 mr-1" />
              {book.year}
            </div>
          </div>

          {/* Reading Status Badge */}
          <div className={`flex items-center px-2 py-0.5 rounded-full border ${statusConfig.style}`}>
             <StatusIcon className="w-3 h-3 mr-1" />
             <span className="text-[10px] font-medium">{statusConfig.label}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-1.5 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors" title={book.title}>
          {book.title}
        </h3>
        
        {/* Author */}
        <div className="flex items-center text-slate-500 text-xs mb-3">
          <User className="w-3 h-3 mr-1 opacity-70" />
          <span className="font-medium">{book.author}</span>
        </div>

        {/* Summary */}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 mb-4 flex-grow font-serif opacity-90" title={book.summary}>
          {book.summary}
        </p>

        {/* Tags */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {book.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 text-[10px] hover:bg-slate-100 transition-colors border border-slate-100">
                <Tag className="w-2.5 h-2.5 mr-1 opacity-40" />
                {tag}
              </span>
            ))}
            
            {/* Improved overflow indicator with Custom Tooltip */}
            {book.tags.length > 3 && (
              <div className="relative group/tooltip inline-flex">
                <span 
                  className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-[10px] border border-slate-200 cursor-help"
                >
                  +{book.tags.length - 3}
                </span>
                {/* Tooltip Popup */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-50">
                    <div className="bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap relative animate-in fade-in zoom-in-95 duration-200">
                        {book.tags.slice(3).join(', ')}
                        {/* Little triangle arrow at bottom */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;