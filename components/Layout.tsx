import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STATUS_LABELS, STATUS_COLORS } from '../constants';
import {
  LayoutDashboard,
  Users,
  Send,
  Wallet,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Phone,
  FileText,
  Settings,
  Trophy
} from 'lucide-react';

const Layout = () => {
  const { clients, contracts, logout, userProfile } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Estados da Busca Inteligente ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof clients>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Lógica de filtro de busca em tempo real
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);

    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(lowerTerm) ||
        (c.document && c.document.includes(lowerTerm)) ||
        (c.phone && c.phone.includes(lowerTerm))
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, clients]);

  // Fechar busca ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica para determinar o status principal do cliente (igual à tela de Clientes)
  const getClientStatus = (clientId: string) => {
    const clientContracts = contracts.filter(c => c.clientId === clientId);

    if (clientContracts.length === 0) return null;

    // Ordem de prioridade para exibição
    const priorities = ['returned', 'in_list', 'eligible', 'in_progress', 'draft', 'completed'];

    for (const status of priorities) {
      if (clientContracts.some(c => c.status === status)) {
        return status;
      }
    }

    return 'completed';
  };

  const handleSelectClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
    setSearchTerm('');
    setIsSearchFocused(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clientes' },
    { to: '/lists', icon: Send, label: 'Listas de Envio' },
    { to: '/financial', icon: Wallet, label: 'Financeiro' },
  ];

  // Componente interno para item da sidebar para manter o código limpo
  const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) => `
        w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group mb-1
        ${isActive
          ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <Icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
            <span className="font-medium text-[15px]">{label}</span>
          </div>
          {isActive && <ChevronRight size={16} className="text-indigo-400 dark:text-indigo-500" />}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans p-0 lg:p-4 gap-4 transition-colors duration-300">

      {/* Overlay de Foco da Busca */}
      {isSearchFocused && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-all duration-300" />
      )}

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Adaptada para ser flutuante no Desktop e fixa no Mobile */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 lg:static
          lg:rounded-[2.5rem] lg:shadow-xl lg:shadow-slate-200/50 dark:lg:shadow-none dark:lg:border-slate-800 lg:border lg:border-slate-100 
          flex flex-col overflow-hidden 
          transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:h-full
        `}
      >
        {/* Header / Logo */}
        <div className="p-8 pb-6 flex justify-between items-center lg:block">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                className="w-6 h-6"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                GC <span className="font-light text-slate-500 dark:text-slate-400">Limpa Nome</span>
              </h1>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <div className="px-2 mb-2 mt-2">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Menu Principal</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <SidebarItem key={item.to} {...item} />
            ))}
          </nav>

          {/* Extra Actions Section */}
          <div className="px-2 mb-2 mt-8">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Outros</p>
          </div>
          <div className="space-y-1">
            {/* CONFIGURAÇÕES AGORA É UM LINK ATIVO */}
            <NavLink
              to="/social-proof"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
                    <span className="font-medium text-[15px]">Prova Social</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-indigo-400 dark:text-indigo-500" />}
                </>
              )}
            </NavLink>
            <NavLink
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Settings size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
                    <span className="font-medium text-[15px]">Configurações</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-indigo-400 dark:text-indigo-500" />}
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{userProfile.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Administrador</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair do sistema"
              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative rounded-[2.5rem] bg-white dark:bg-slate-900 lg:shadow-sm lg:border lg:border-slate-200 dark:lg:border-slate-800">

        {/* Topbar com Busca Centralizada */}
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center lg:hidden mr-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
          </div>

          {/* Área de Busca */}
          <div className="flex-1 flex justify-center px-4">
            <div
              ref={searchRef}
              className={`relative transition-all duration-500 ease-out z-50 ${isSearchFocused
                ? 'w-full max-w-2xl scale-105'
                : 'w-full max-w-lg'
                }`}
            >
              <div className={`relative flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 transition-all ${isSearchFocused ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-200/50 dark:shadow-none' : 'border-transparent'}`}>
                <Search className={`absolute left-4 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-slate-400'}`} size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Buscar Nome, CPF, CNPJ ou Telefone..."
                  className="w-full pl-12 pr-4 py-2.5 bg-transparent rounded-2xl text-slate-900 dark:text-white font-medium focus:outline-none placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="pr-4 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Dropdown de Resultados */}
              {isSearchFocused && (searchTerm.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {searchResults.length > 0 ? (
                      searchResults.map(client => {
                        const statusKey = getClientStatus(client.id);
                        return (
                          <button
                            key={client.id}
                            onClick={() => handleSelectClient(client.id)}
                            className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 shadow-sm">
                                {client.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">{client.name}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                  <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"><FileText size={10} /> {client.document}</span>
                                  <span className="flex items-center gap-1"><Phone size={10} /> {client.phone}</span>
                                  {statusKey && (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_COLORS[statusKey]}`}>
                                      {STATUS_LABELS[statusKey]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400" />
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <div className="bg-slate-50 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search size={20} className="text-slate-300 dark:text-slate-500" />
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Nenhum cliente encontrado para "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Busca Global</span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{searchResults.length} resultados</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center ml-4 gap-4">
            {/* User Avatar no Header (Mobile Only ou Simplificado Desktop) */}
            <div className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;