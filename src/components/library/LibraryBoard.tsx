import React, { useState, useMemo } from 'react';
import { booksData } from './booksData';
import BookCard from './BookCard';
import Stats from './Stats';
import type { ChartData } from './Stats';
import { Search, Library, X, Filter } from 'lucide-react';

const LibraryBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories and sort them intelligently
  const categories = useMemo(() => {
    const cats = new Set(booksData.map((b) => b.category));
    const predefinedOrder = ['All', '小说', '科技', '历史', '经管', '传记', '哲学', '心理', '其他'];
    const availableCats = Array.from(cats);

    // Sort: Predefined items first in order, then any new/unknown categories alphabetically
    return ['All', ...availableCats.sort((a, b) => {
      const indexA = predefinedOrder.indexOf(a);
      const indexB = predefinedOrder.indexOf(b);
      
      // If both are in predefined list, sort by that order
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // If only A is predefined, it comes first
      if (indexA !== -1) return -1;
      // If only B is predefined, it comes first
      if (indexB !== -1) return 1;
      // Otherwise sort alphabetically
      return a.localeCompare(b, 'zh-CN');
    })];
  }, []);

  // Filter books logic
  const filteredBooks = useMemo(() => {
    return booksData.filter((book) => {
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.summary.toLowerCase().includes(searchLower) ||
        book.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  // Stats data preparation
  const statsData: ChartData[] = useMemo(() => {
    const map = new Map<string, number>();
    booksData.forEach((book) => {
      map.set(book.category, (map.get(book.category) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  }, []);

  return (
    <div className="min-h-screen text-slate-800 bg-slate-50/50">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-indigo-700 cursor-pointer" onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'})}}>
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Library className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight font-serif text-slate-900">我的藏书馆</h1>
          </div>
          
          <div className="hidden md:flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
             <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
             已收录 {booksData.length} 本好书
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Statistics Section */}
        <Stats data={statsData} totalBooks={booksData.length} />

        {/* Floating Search & Filter Bar */}
        <div className="sticky top-20 z-30 mb-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white p-2 md:p-3 max-w-5xl mx-auto ring-1 ring-slate-900/5">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              
              {/* Category Pills with Horizontal Scroll */}
              <div className="w-full overflow-x-auto pb-1 md:pb-0 no-scrollbar order-2 md:order-1">
                <div className="flex gap-2 px-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'All' ? '全部' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72 flex-shrink-0 order-1 md:order-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索书名 / 作者 / 标签..."
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-slate-800 font-serif flex items-center">
            {selectedCategory === 'All' ? '所有书籍' : selectedCategory}
            <span className="ml-3 text-sm font-sans font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredBooks.length}
            </span>
          </h2>
          {(searchTerm || selectedCategory !== 'All') && (
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
            >
              <Filter className="w-3 h-3 mr-1" />
              重置筛选
            </button>
          )}
        </div>

        {/* Book Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
               <Library className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">未找到相关书籍</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              我们找不到与 "{searchTerm}" 相关的书籍{selectedCategory !== 'All' ? ` (在分类: ${selectedCategory} 中)` : ''}。
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              清除所有筛选条件
            </button>
          </div>
        )}
      </main>
      
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} My Digital Library. Designed for readers.</p>
        </div>
      </footer>
    </div>
  );
};

export default LibraryBoard;