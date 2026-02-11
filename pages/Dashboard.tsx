import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../constants';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  MoreHorizontal, 
  ArrowRight, 
  Plus,
  X,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- COMPONENTES AUXILIARES ---

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, trend }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          +12% <TrendingUp size={12} />
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
    </div>
  </div>
);

const HTMLBarChart = ({ stats }: { stats: any }) => {
  const data = [
    { label: 'Ativos', value: stats.activeContracts, color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600', shadow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]' },
    { label: 'Elegíveis', value: stats.eligibleContracts, color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600', shadow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
    { label: 'Em Lista', value: stats.inListContracts, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', shadow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
    { label: 'Concluídos', value: stats.completedContracts, color: 'bg-slate-700', hoverColor: 'hover:bg-slate-800', shadow: 'group-hover:shadow-[0_0_20px_rgba(51,65,85,0.3)]' },
  ];

  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

  return (
    <div className="flex items-end justify-between h-48 gap-4 px-2">
      {data.map((item, idx) => {
        const heightPercent = (item.value / maxValue) * 100;
        return (
          <div key={idx} className="flex flex-col items-center gap-2 w-full group h-full justify-end">
            <div className="w-full bg-slate-50 rounded-t-lg h-full relative flex items-end overflow-hidden">
              <div 
                style={{ height: `${heightPercent}%` }}
                className={`w-full ${item.color} ${item.hoverColor} transition-all duration-500 rounded-t-lg relative ${item.shadow}`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const ModalNovoCliente = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addClient } = useApp();
  const [formData, setFormData] = useState({ name: '', document: '', phone: '', email: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.document) {
      addClient(formData);
      setFormData({ name: '', document: '', phone: '', email: '' });
      onClose();
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 14) value = value.slice(0, 14);

    if (value.length > 11) {
      // Máscara CNPJ: 00.000.000/0000-00
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Máscara CPF: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    setFormData({...formData, document: value});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-white to-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Novo Cliente</h2>
            <p className="text-slate-500 text-sm mt-1">Preencha as dados para cadastrar.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo / Razão Social</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: João Silva" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">CPF / CNPJ</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  required
                  type="text" 
                  maxLength={18}
                  placeholder="000.000.000-00" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                  value={formData.document}
                  onChange={handleDocumentChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Telefone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="(00) 00000-0000" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="cliente@email.com" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl text-slate-600 font-medium hover:bg-slate-200 transition-all">Cancelar</button>
            <button type="submit" className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">Salvar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const Dashboard = () => {
  const { stats, lists } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500 mt-1">Acompanhe o desempenho e métricas em tempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            Atualizado hoje
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            Adicionar Cliente
          </button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Receita Total" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={DollarSign} 
          colorClass="bg-emerald-500 text-emerald-500"
          trend
        />
        <KPICard 
          title="Saldo a Receber" 
          value={formatCurrency(stats.outstandingBalance)} 
          icon={TrendingUp} 
          colorClass="bg-blue-500 text-blue-500"
          trend
        />
        <KPICard 
          title="Contratos Ativos" 
          value={stats.activeContracts} 
          subtext="Em progresso + Elegíveis"
          icon={FileText} 
          colorClass="bg-violet-500 text-violet-500"
        />
        <KPICard 
          title="Casos Retornados" 
          value={stats.returnedContracts} 
          icon={AlertCircle} 
          colorClass="bg-rose-500 text-rose-500"
        />
      </div>

      {/* Grid de Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Barras */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Volume de Contratos</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <HTMLBarChart stats={stats} />
        </div>

        {/* Lista Recente */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Listas Recentes</h3>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
            {lists.length > 0 ? (
              lists.slice(0, 5).map(list => (
                <div key={list.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all group cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-800 group-hover:text-amber-700">{list.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${list.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {list.status === 'completed' ? 'Concluída' : 'Aberta'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>{new Date(list.createdAt).toLocaleDateString()}</span>
                    <span>{list.itemsCount} itens</span>
                  </div>
                </div>
              ))
            ) : (
               /* Placeholder para itens vazios */
              <div className="border-2 border-dashed border-slate-100 rounded-2xl p-4 flex items-center justify-center text-slate-400 text-sm h-24">
                Nenhuma lista criada
              </div>
            )}
          </div>

          <Link to="/lists" className="w-full mt-6 py-2.5 text-indigo-600 font-medium hover:bg-indigo-50 rounded-2xl transition-colors flex items-center justify-center gap-2 group">
            Ver todas
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Renderização Condicional do Modal */}
      <ModalNovoCliente isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;