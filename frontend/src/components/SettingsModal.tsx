"use client";
import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'accounts' | 'categories'>('accounts');
  
  // States para Cuentas
  const [accounts, setAccounts] = useState<any[]>([]);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState('bank');

  // States para Categorías
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [accs, cats] = await Promise.all([
        apiFetch('/accounts/'),
        apiFetch('/categories/')
      ]);
      setAccounts(accs);
      setCategories(cats);
    } catch (e: any) {
      console.error(e);
      setError('Error cargando datos: ' + e.message);
    }
  };

  // --- CRUD Cuentas ---
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/accounts/', {
        method: 'POST',
        body: JSON.stringify({ name: newAccName, type: newAccType })
      });
      setNewAccName('');
      fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm('¿Eliminar esta cuenta y sus transacciones?')) return;
    try {
      await apiFetch(`/accounts/${id}/`, { method: 'DELETE' });
      fetchData();
    } catch (e: any) { setError(e.message); }
  };

  // --- CRUD Categorías ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/categories/', {
        method: 'POST',
        body: JSON.stringify({ name: newCatName, color: newCatColor })
      });
      setNewCatName('');
      fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('¿Eliminar categoría? Las transacciones asociadas quedarán sin categoría.')) return;
    try {
      await apiFetch(`/categories/${id}/`, { method: 'DELETE' });
      fetchData();
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className={`absolute inset-0 bg-[#0B1121]/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      
      <div className={`relative bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-2xl p-0 shadow-2xl shadow-sky-900/10 m-4 flex flex-col transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden h-[600px] ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.95]'}`}>
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white tracking-tight">Opciones del Sistema</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-slate-800/80 bg-[#0B1121]/50 p-4">
             <button 
                onClick={() => setActiveTab('accounts')}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium mb-1 transition-colors ${activeTab === 'accounts' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
             >
               Cuentas Bancarias
             </button>
             <button 
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
             >
               Categorías
             </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-[#0f172a] p-6 overflow-y-auto">
            {error && <p className="text-rose-400 text-xs mb-4 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</p>}
            
            {/* TAB: ACCOUNTS */}
            {activeTab === 'accounts' && (
              <div className="flex flex-col h-full animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Tus Cuentas</h3>
                
                <div className="space-y-2 flex-1">
                  {accounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center p-3 border border-slate-800 rounded-xl hover:bg-[#0B1121] transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{acc.name}</p>
                        <p className="text-xs text-slate-500">{acc.type === 'bank' ? 'Banco' : acc.type === 'cash' ? 'Efectivo' : 'Tarjeta'}</p>
                      </div>
                      <button onClick={() => handleDeleteAccount(acc.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  ))}
                  {accounts.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No hay cuentas</p>}
                </div>

                <form onSubmit={handleAddAccount} className="pt-4 border-t border-slate-800 mt-4 flex gap-2">
                  <input type="text" value={newAccName} onChange={e => setNewAccName(e.target.value)} required placeholder="Nueva cuenta..." className="flex-1 bg-[#0B1121] border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 transition-colors" />
                  <select value={newAccType} onChange={e => setNewAccType(e.target.value)} className="bg-[#0B1121] border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500">
                    <option value="bank">Banco</option>
                    <option value="cash">Efectivo</option>
                    <option value="credit">Tarjeta</option>
                  </select>
                  <button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-400 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors">+</button>
                </form>
              </div>
            )}

            {/* TAB: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="flex flex-col h-full animate-fade-in">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Tus Categorías</h3>
                
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-3 border border-slate-800 rounded-xl hover:bg-[#0B1121] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: cat.color }} />
                        <p className="text-sm font-medium text-slate-200">{cat.name}</p>
                      </div>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No hay categorías</p>}
                </div>

                <form onSubmit={handleAddCategory} className="pt-4 border-t border-slate-800 mt-4 flex gap-2">
                  <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} required placeholder="Nueva categoría..." className="flex-1 bg-[#0B1121] border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 transition-colors" />
                  <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} title="Color" className="h-10 w-10 bg-[#0B1121] border border-slate-800 rounded-xl overflow-hidden cursor-pointer p-0" />
                  <button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-400 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors">+</button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
