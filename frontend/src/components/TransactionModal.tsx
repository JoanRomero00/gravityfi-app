"use client";
import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTx?: any | null; // Data of full transaction to edit
}

export default function TransactionModal({ isOpen, onClose, onSuccess, editTx }: TransactionModalProps) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editTx) {
        setType(editTx.type);
        setAmount(editTx.amount.toString());
        setDescription(editTx.description);
        setDate(editTx.date);
        if (editTx.account) setAccountId(editTx.account.toString());
        if (editTx.category) setCategoryId(editTx.category.toString());
      } else {
        setAmount('');
        setDescription('');
      }

      Promise.all([
        apiFetch('/accounts/'),
        apiFetch('/categories/')
      ]).then(([accs, cats]) => {
        setAccounts(accs);
        setCategories(cats);
        if (!editTx) {
          if (accs.length > 0) setAccountId(accs[0].id.toString());
          if (cats.length > 0) setCategoryId(cats[0].id.toString());
        }
      }).catch(e => console.error(e));
    }
  }, [isOpen, editTx]);

  const handleDelete = async () => {
    if(!confirm("¿Eliminar este movimiento permanentemente?")) return;
    setLoading(true);
    try {
      await apiFetch(`/transactions/${editTx.id}/`, { method: 'DELETE' });
      onSuccess();
      onClose();
    } catch(e: any) { setError(e.message) }
    finally { setLoading(false) }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editTx ? `/transactions/${editTx.id}/` : '/transactions/';
      const method = editTx ? 'PUT' : 'POST';

      await apiFetch(url, {
        method,
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          description,
          date,
          account: parseInt(accountId),
          category: parseInt(categoryId)
        })
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la transacción. Verifica que existan cuentas/categorías ID 1.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#0B1121]/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div 
        className={`relative bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl shadow-sky-900/10 m-4 flex flex-col transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.95]'
        }`}
      >
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {editTx ? 'Editar Movimiento' : 'Nueva Transacción'}
          </h2>
          <div className="flex items-center gap-2">
            {editTx && (
              <button type="button" onClick={handleDelete} title="Eliminar" disabled={loading} className="p-1 text-slate-500 hover:text-rose-400 focus:outline-none transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            )}
            <button type="button" onClick={onClose} className="p-1 text-slate-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4">
            <button 
              type="button" 
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'expense' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Gasto
            </button>
            <button 
              type="button" 
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'income' ? 'bg-emerald-500/10 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-emerald-400/70'}`}
            >
              Ingreso
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Monto ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-[#0B1121] border border-slate-800 text-3xl font-semibold text-white rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Descripción</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-[#0B1121] border border-slate-800 text-sm text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="Ej: Cena en restaurante"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Fecha</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#0B1121] border border-slate-800 text-sm text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Cuenta Origen</label>
              <select 
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
                className="w-full bg-[#0B1121] border border-slate-800 text-sm text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
              >
                {accounts.length === 0 && <option value="">Sin cuentas</option>}
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Categoría Asignada</label>
            <select 
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-[#0B1121] border border-slate-800 text-sm text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
            >
              {categories.length === 0 && <option value="">Sin categorías</option>}
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-semibold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 ${type === 'expense' ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'} disabled:opacity-50`}
            >
              {loading ? 'Procesando...' : editTx ? 'Guardar Cambios' : `Confirmar ${type === 'expense' ? 'Gasto' : 'Ingreso'}`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
