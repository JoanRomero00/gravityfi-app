"use client";

import React, { useState, useEffect } from 'react';
import { logout, apiFetch } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import TransactionModal from '@/components/TransactionModal';
import SettingsModal from '@/components/SettingsModal';

// Elegantes iconos SVG estilo minimalista (Grosor de línea 1.5)
const Icons = {
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  LayoutDashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Receipt: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1v-20l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>,
  PieChart: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ArrowUpRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>,
  ArrowDownRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17h10V7"/><path d="M7 7l10 10"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [summary, setSummary] = useState<any>({ total_income: 0, total_expense: 0, balance: 0, expenses_by_category: [] });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [txToEdit, setTxToEdit] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      const summaryData = await apiFetch('/summary/');
      const txData = await apiFetch(`/transactions/?page=${page}${filterType ? `&type=${filterType}` : ''}`);
      setSummary(summaryData);
      // Django returns { count, next, previous, results } due to pagination
      setTransactions(txData.results || []);
      setHasMore(!!txData.next);
    } catch (e) {
      console.error("Error cargando dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [page, filterType]);

  const openTxModal = (tx: any = null) => {
    setTxToEdit(tx);
    setIsTxModalOpen(true);
  };

  const formatMoney = (amount: number | string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));
  };

  const remainingIncome = summary.total_income - summary.total_expense;
  const chartData = [
    ...(summary.expenses_by_category || []).map((item: any) => ({
      name: item.category__name || 'Sin Categoría',
      value: parseFloat(item.total),
      color: item.category__color || '#ef4444'
    })),
    ...(remainingIncome > 0 ? [{ name: 'Disponible (Ahorro)', value: remainingIncome, color: '#10b981' }] : [])
  ];

  const hasDataToChart = chartData.length > 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex overflow-hidden font-sans">
      {/* Fondo base sin desenfoques excesivos, puro minimalismo de bordes */}
      
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1121] border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            GravityFi
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">General</p>
          <NavItem icon={<Icons.LayoutDashboard />} label="Dashboard Principal" active />
          <NavItem icon={<Icons.Receipt />} label="Mis Gastos" />
          <NavItem icon={<Icons.PieChart />} label="Presupuestos" />
          
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8">Configuración</p>
          <NavItem icon={<Icons.Settings />} label="Ajustes de cuenta" onClick={() => setIsSettingsOpen(true)} />
        </nav>

        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/40 cursor-pointer transition-colors group">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-300 border border-slate-700 group-hover:border-slate-500 transition-colors">
              JR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">JM Romero</p>
              <p className="text-xs text-slate-500 truncate">jmromero@gravity.fi</p>
            </div>
            <button 
              onClick={logout}
              className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-200 mr-1"
              title="Cerrar sesión"
            >
              <Icons.LogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Superior Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0B1121]/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Icons.Menu />
            </button>
            <h2 className="text-sm font-medium text-slate-300 hidden sm:block">Resumen Mensual</h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Icons.Search />
              </div>
              <input 
                type="text" 
                placeholder="Buscar transacción..." 
                className="bg-[#0f172a] border border-slate-800 text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-200 placeholder-slate-500 w-64 transition-shadow"
              />
            </div>
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Icons.Bell />
              <span className="absolute 0 right-0 w-2 h-2 bg-sky-500 rounded-full border border-[#0B1121]"></span>
            </button>
            <button 
              onClick={() => openTxModal(null)}
              className="hidden sm:flex bg-white text-slate-950 hover:bg-slate-200 text-sm font-medium py-1.5 px-4 rounded-full items-center gap-2 transition-colors"
            >
              <Icons.Plus /> Agregar Gasto
            </button>
            <button 
              onClick={() => openTxModal(null)}
              className="sm:hidden bg-white text-slate-950 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <Icons.Plus />
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            
            {/* Header text */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Bienvenido de nuevo, JM</h2>
              <p className="text-sm text-slate-400 mt-1">Aquí está tu reporte financiero al día de hoy.</p>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <MetricCard title="Balance Total" amount={loading ? '...' : formatMoney(summary.balance)} trend="Al día" isGood />
              <MetricCard title="Ingresos Totales" amount={loading ? '...' : formatMoney(summary.total_income)} trend="Histórico" isGood />
              <MetricCard title="Gastos Totales" amount={loading ? '...' : formatMoney(summary.total_expense)} trend="Histórico" isGood={false} invertGoodLogic />
            </div>

            {/* Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart Card */}
              <div className="lg:col-span-2 border border-slate-800/80 bg-[#0B1121]/30 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-base font-semibold text-white">Análisis de Flujo</h3>
                   <select className="bg-[#0f172a] border border-slate-800 text-sm text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                     <option>Este Mes</option>
                     <option>Mes Anterior</option>
                   </select>
                </div>
                <div className="w-full h-64 flex items-center justify-center">
                  {loading ? (
                    <p className="text-sm text-slate-500 pb-4">Cargando gráfico...</p>
                  ) : hasDataToChart ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((item: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={item.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any, name: any) => [formatMoney(value), name]}
                          contentStyle={{ backgroundColor: '#0B1121', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                          itemStyle={{ color: '#e2e8f0', fontWeight: '500' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-slate-800/20 to-transparent border border-dashed border-slate-800 rounded-xl flex items-center justify-center">
                      <p className="text-slate-500 text-sm flex items-center gap-2">
                        <Icons.PieChart /> Sin movimientos registrados
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions list */}
              <div className="border border-slate-800/80 bg-[#0B1121]/30 rounded-2xl flex flex-col">
                <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-[#0f172a] rounded-t-2xl">
                  <h3 className="text-base font-semibold text-white">Últimos Movimientos</h3>
                  <select 
                    value={filterType} 
                    onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                    className="bg-[#0B1121] border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Todos</option>
                    <option value="expense">Solo Gastos</option>
                    <option value="income">Solo Ingresos</option>
                  </select>
                </div>
                <div className="p-2 flex-1 flex flex-col">
                  {loading && transactions.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">Cargando transacciones...</p>
                  ) : transactions.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">No hay movimientos en este filtro.</p>
                  ) : (
                    <div className="flex-1">
                      {transactions.map((tx: any) => (
                        <TransactionRow 
                          key={tx.id}
                          title={tx.description || 'Monto sin nombre'} 
                          category={tx.type === 'income' ? 'Ingreso' : 'Gasto'} 
                          amount={`${tx.type === 'income' ? '+' : '-'}${formatMoney(tx.amount)}`} 
                          date={tx.date} 
                          isIncome={tx.type === 'income'}
                          onClick={() => openTxModal(tx)}
                        />
                      ))}
                    </div>
                  )}
                  {/* Paginación minimalista */}
                  <div className="mt-4 pt-2 border-t border-slate-800 flex justify-between items-center px-4 pb-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page === 1}
                      className="text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      &larr; Anterior
                    </button>
                    <span className="text-xs text-slate-600">Pág {page}</span>
                    <button 
                      onClick={() => setPage(p => p + 1)} 
                      disabled={!hasMore}
                      className="text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      Siguiente &rarr;
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      <TransactionModal 
        isOpen={isTxModalOpen} 
        onClose={() => setIsTxModalOpen(false)} 
        onSuccess={fetchDashboardData} 
        editTx={txToEdit}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

// ------ UI Subcomponents ------

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
      active 
        ? 'bg-sky-500 text-white' 
        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
    }`}>
      <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
      {label}
    </button>
  );
}

function MetricCard({ title, amount, trend, isGood, invertGoodLogic = false }: { title: string, amount: string, trend: string, isGood: boolean, invertGoodLogic?: boolean }) {
  // Logic for green (good) vs red (bad) trend text
  const isPositiveTrend = invertGoodLogic ? !isGood : isGood;
  
  return (
    <div className="border border-slate-800/80 bg-[#0B1121]/50 rounded-2xl p-6 transition-colors hover:bg-[#0B1121]">
      <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-tight text-white">{amount}</p>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
          isPositiveTrend ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'
        }`}>
          {isGood ? <Icons.ArrowUpRight /> : <Icons.ArrowDownRight />}
          {trend}
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ title, category, amount, date, isIncome = false, onClick }: { title: string, category: string, amount: string, date: string, isIncome?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        {/* Ícono dinámico según tipo de transacción */}
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isIncome ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20' : 'bg-slate-800 border-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}`}>
          <Icons.Receipt />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200 leading-tight">{title}</p>
          <p className="text-xs text-slate-500 mt-1">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold tracking-tight ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>{amount}</p>
        <p className="text-xs text-slate-500 mt-1">{date}</p>
      </div>
    </div>
  );
}
