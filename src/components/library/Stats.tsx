import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { BookOpen, TrendingUp } from 'lucide-react';

export interface ChartData {
  name: string;
  value: number;
}

interface StatsProps {
  data: ChartData[];
  totalBooks: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-100 shadow-xl rounded-lg text-sm">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <p className="text-indigo-600 font-medium">
          <span className="mr-1 text-slate-400">藏书:</span>
          {payload[0].value} 本
        </p>
      </div>
    );
  }
  return null;
};

// Colors for the chart bars matching the categories
const getBarColor = (name: string) => {
   switch (name) {
    case '小说': return '#3b82f6'; // blue-500
    case '科技': return '#06b6d4'; // cyan-500
    case '历史': return '#d97706'; // amber-600
    case '经管': return '#10b981'; // emerald-500
    case '哲学': return '#8b5cf6'; // violet-500
    case '心理': return '#f43f5e'; // rose-500
    case '传记': return '#0d9488'; // teal-600
    default: return '#64748b';    // slate-500
  }
};

const Stats: React.FC<StatsProps> = ({ data, totalBooks }) => {
  const topCategory = data.length > 0 ? data[0].name : '无';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {/* Summary Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-indigo-400 opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-indigo-100">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">Total Collection</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold tracking-tight">{totalBooks}</span>
            <span className="text-lg opacity-80">books</span>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
             <div className="text-sm text-indigo-100">
               <span className="block opacity-60 text-xs">Top Category</span>
               <span className="font-semibold text-lg">{topCategory}</span>
             </div>
             <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-white" />
             </div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
        <div className="mb-6 flex justify-between items-center">
           <div>
             <h3 className="text-slate-800 font-bold text-lg">阅读偏好分布</h3>
             <p className="text-slate-500 text-sm">按书籍类别统计</p>
           </div>
        </div>
        
        <div className="flex-grow w-full h-64">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                axisLine={false}
                tickLine={false}
                interval={0}
                dy={10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{fill: '#f8fafc', radius: 4}} 
              />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 6, 6]} 
                barSize={32}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;