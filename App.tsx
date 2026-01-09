
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Utensils, 
  ArrowUpRight, 
  Filter, 
  Wine,
  BarChart3
} from 'lucide-react';
import { MENU_DATA } from './data';
import { MenuItem, Stats } from './types';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    return ["Все", ...Array.from(new Set(MENU_DATA.map(item => item.category)))];
  }, []);

  const stats: Stats = useMemo(() => {
    const totalOld = MENU_DATA.reduce((acc, item) => acc + item.oldPrice, 0);
    const totalNew = MENU_DATA.reduce((acc, item) => acc + item.newPrice, 0);
    const diff = totalNew - totalOld;
    const count = MENU_DATA.length;

    return {
      avgGrowthRub: Math.round(diff / count),
      avgGrowthPercent: totalOld > 0 ? ((diff / totalOld) * 100).toFixed(1) : '0',
      totalItems: count,
      totalRevenueImpact: diff
    };
  }, []);

  const filteredItems = useMemo(() => {
    return MENU_DATA.filter(item => {
      const matchesCategory = activeCategory === 'Все' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-wine-700 rounded-xl flex items-center justify-center text-cream font-serif font-bold text-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform cursor-default">
                T
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-serif font-bold text-wine-700 leading-none tracking-tight">TBILISO</h1>
                <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold mt-1">Menu Strategy 2026</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xs ml-4 sm:ml-8">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-wine-700 transition-colors" />
                <input
                  type="text"
                  placeholder="Поиск блюд..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-full text-sm bg-stone-50 focus:ring-2 focus:ring-wine-200 focus:border-wine-700 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide border-t border-stone-100 gap-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  whitespace-nowrap py-3 text-sm font-semibold transition-all relative
                  ${activeCategory === cat ? 'text-wine-700' : 'text-stone-400 hover:text-stone-600'}
                `}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-wine-700 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* DASHBOARD */}
      <section className="bg-white border-b border-stone-200 py-8 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.01)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              label="Средний рост" 
              value={`+${stats.avgGrowthPercent}%`} 
              icon={<TrendingUp className="w-5 h-5" />} 
              colorClass="text-wine-700" 
            />
            <StatCard 
              label="Прибыль / блюдо" 
              value={`+${stats.avgGrowthRub} ₽`} 
              icon={<DollarSign className="w-5 h-5" />} 
              colorClass="text-emerald-600" 
            />
            <StatCard 
              label="Позиций в меню" 
              value={stats.totalItems.toString()} 
              icon={<Utensils className="w-5 h-5" />} 
              colorClass="text-stone-600" 
            />
            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-wine-700 to-wine-900 p-5 rounded-2xl shadow-xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="relative z-10">
                <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                  <BarChart3 className="w-3 h-3" /> Стратегия
                </p>
                <h4 className="font-serif text-lg leading-tight text-cream">
                  Оптимизация маржи 2026
                </h4>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
              <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-cream/50" />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-300">
            <Filter className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Блюда не найдены</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('Все');}}
              className="mt-4 text-wine-700 font-bold hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// HELPER COMPONENTS

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; colorClass: string }> = ({ 
  label, value, icon, colorClass 
}) => (
  <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all">
    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-2">{label}</span>
    <div className={`flex items-center gap-2 ${colorClass}`}>
      {icon}
      <span className="text-2xl font-serif font-bold tracking-tight">{value}</span>
    </div>
  </div>
);

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const diff = item.newPrice - item.oldPrice;
  const percent = item.oldPrice > 0 ? ((diff / item.oldPrice) * 100).toFixed(1) : '0';
  const isHighImpact = Number(percent) > 12;

  return (
    <div className="group bg-white border border-stone-100 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-xl hover:shadow-stone-200/50 hover:border-wine-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-black text-wine-700 uppercase tracking-wider bg-wine-50 px-2 py-1 rounded-lg border border-wine-100">
            {item.category}
          </span>
          {isHighImpact && (
            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 flex items-center gap-1 animate-pulse">
              <TrendingUp className="w-3 h-3" /> HIGH GROWTH
            </span>
          )}
        </div>
        <h3 className="text-xl font-serif font-bold text-stone-800 group-hover:text-wine-700 transition-colors truncate pr-4">
          {item.name}
        </h3>
      </div>

      <div className="flex items-center gap-4 sm:gap-10 justify-between sm:justify-end">
        {/* Comparison */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-stone-400 uppercase font-black tracking-widest mb-0.5">WAS</span>
            <span className="text-lg font-medium text-stone-400 line-through decoration-stone-300">
              {item.oldPrice}
            </span>
          </div>
          <div className="w-px h-8 bg-stone-100" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-wine-700 uppercase font-black tracking-widest mb-0.5">NOW</span>
            <span className="text-2xl font-black text-wine-700 leading-none">
              {item.newPrice}<span className="text-sm ml-1 opacity-40">₽</span>
            </span>
          </div>
        </div>

        {/* Change Badge */}
        <div className={`
          flex flex-col items-center justify-center min-w-[90px] px-3 py-2 rounded-xl shadow-sm border
          ${diff > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-stone-50 border-stone-200 text-stone-400'}
        `}>
          <div className="flex items-center gap-0.5 text-sm font-black">
            {diff > 0 ? <ArrowUpRight className="w-3 h-3" /> : null}
            {diff > 0 ? `+${diff}` : diff} ₽
          </div>
          <div className="text-[10px] font-bold opacity-70">
            +{percent}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
