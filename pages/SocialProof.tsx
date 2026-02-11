import React, { useState, useEffect } from 'react';
import { Play, Users, StopCircle, Check, ArrowLeft, Share2, Download } from 'lucide-react';

const SocialProof = () => {
    // Configuration State
    const [totalCount, setTotalCount] = useState<string>('50');
    const [listName, setListName] = useState<string>('Lista VIP');
    const [rawNames, setRawNames] = useState<string>('');

    // Simulation State
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentName, setCurrentName] = useState<{ name: string; doc: string } | null>(null);

    // Parsed Data
    const getParsedData = () => {
        return rawNames.split('\n').filter(line => line.trim().length > 0).map(line => {
            const [name, doc] = line.split(',');
            return { name: name?.trim(), doc: doc?.trim() || '***.***.***-**' };
        });
    };

    const handleStart = () => {
        if (!totalCount || !listName) return;
        setIsRunning(true);
        setIsCompleted(false);
        setProgress(0);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsCompleted(false);
        setProgress(0);
        setCurrentName(null);
    };

    // Simulation Logic
    useEffect(() => {
        if (!isRunning) return;

        const duration = 10000; // 10 seconds
        const intervalTime = 100;
        const steps = duration / intervalTime;
        let currentStep = 0;

        const data = getParsedData();

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = Math.min((currentStep / steps) * 100, 100);
            setProgress(newProgress);

            // Randomly show names
            if (data.length > 0 && Math.random() > 0.3) {
                const randomItem = data[Math.floor(Math.random() * data.length)];
                setCurrentName(randomItem);
            }

            if (currentStep >= steps) {
                clearInterval(timer);
                setIsRunning(false);
                setIsCompleted(true);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [isRunning, rawNames]);

    return (
        <div className="min-h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Prova Social</h1>
                <p className="text-slate-500 dark:text-slate-400">Simulação de processamento de lista.</p>
            </div>

            {!isRunning && !isCompleted ? (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Nome da Lista (Simulada)</label>
                            <input
                                type="text"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Ex: Lote Pagamento Antecipado"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Total de Nomes (Resultado Final)</label>
                            <input
                                type="number"
                                value={totalCount}
                                onChange={(e) => setTotalCount(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Ex: 150"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Nomes e CPFs (Um por linha, separado por vírgula)</label>
                            <p className="text-xs text-slate-400 mb-2">Formato: Nome Cliente, 123.456.789-00</p>
                            <textarea
                                value={rawNames}
                                onChange={(e) => setRawNames(e.target.value)}
                                className="w-full h-40 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                                placeholder="João Silva, 123.456.789-00&#10;Maria Santos, 987.654.321-11"
                            />
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            <Play size={20} fill="currentColor" />
                            Iniciar Simulação
                        </button>
                    </div>
                </div>
            ) : (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 overflow-hidden">
                    {/* Styles for both screens */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .bg-gradient-animated {
                            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
                            background-size: 400% 400%;
                            animation: gradientBG 15s ease infinite;
                        }
                        @keyframes gradientBG {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        .progress-bar-animated {
                            background: linear-gradient(90deg, #818cf8, #c084fc, #6366f1);
                            background-size: 200% 100%;
                            animation: moveGradient 2s linear infinite;
                            box-shadow: 0 0 15px rgba(129, 140, 248, 0.5);
                        }
                        @keyframes moveGradient {
                            0% { background-position: 0% 0%; }
                            100% { background-position: 200% 0%; }
                        }
                        .privacy-blur {
                            filter: blur(4px);
                            user-select: none;
                            pointer-events: none;
                        }
                        @keyframes float {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-10px); }
                        }
                        .floating { animation: float 6s ease-in-out infinite; }
                        .glass-card {
                            background: rgba(255, 255, 255, 0.03);
                            backdrop-filter: blur(12px);
                            -webkit-backdrop-filter: blur(12px);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                        }
                        .mask-fade {
                            mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 60%, transparent 100%);
                            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 60%, transparent 100%);
                        }
                    `}} />

                    {isRunning && (
                        <>
                            {/* Dark animated background */}
                            <div className="fixed inset-0 bg-gradient-animated z-[-1]" />
                            <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[80px] opacity-40 z-[-1]" />
                            <div className="fixed bottom-[-10%] right-[-10%] w-80 h-80 bg-purple-500 rounded-full blur-[80px] opacity-40 z-[-1]" />

                            <div className="max-w-md w-full text-center space-y-8 floating">
                                {/* Header */}
                                <div className="space-y-2">
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
                                        Processando Lista...
                                    </h1>
                                    <p className="text-indigo-300 text-sm font-medium tracking-widest uppercase opacity-80">
                                        {listName}
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-3">
                                    <div className="h-[10px] bg-white/10 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full progress-bar-animated rounded-full transition-all duration-[400ms] ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="text-sm font-mono text-indigo-200">{Math.round(progress)}%</span>
                                    </div>
                                </div>

                                {/* Glass User Card */}
                                <div className="glass-card rounded-2xl p-6 transition-all duration-500 transform hover:scale-[1.02]">
                                    {currentName ? (
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xl font-semibold">
                                                <span className="text-white">{currentName.name.split(' ')[0]}</span>
                                                <span className="text-white privacy-blur">{currentName.name.split(' ').slice(1).join(' ')}</span>
                                            </div>
                                            <p className="text-indigo-200/60 text-sm font-mono tracking-wider privacy-blur">{currentName.doc}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status Text */}
                                <p className="text-xs text-indigo-300/40 italic">
                                    Criptografando dados sensíveis para sua segurança...
                                </p>
                            </div>
                        </>
                    )}

                    {isCompleted && (
                        <>
                            {/* Light background for completed */}
                            <div className="fixed inset-0 bg-[#f8fafc] z-[-1]" />
                            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
                                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60"></div>
                            </div>

                            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-10 text-center transition-all duration-1000 transform animate-in fade-in slide-in-from-bottom-4">
                                {/* Ícone Animado */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-40 scale-150 animate-pulse"></div>
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200 transition-transform hover:scale-110 duration-500">
                                        <Check className="text-white w-10 h-10 stroke-[3px]" />
                                    </div>
                                </div>

                                {/* Estatísticas Principais */}
                                <div className="space-y-2 mb-10">
                                    <h1 className="text-6xl font-black text-slate-900 tracking-tight">
                                        {totalCount}
                                    </h1>
                                    <p className="text-slate-500 font-medium text-lg uppercase tracking-widest">
                                        Nomes Enviados
                                    </p>
                                </div>

                                {/* Card do Resultado */}
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-3xl p-6 mb-10 shadow-sm group hover:shadow-md transition-shadow overflow-hidden">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3 block">
                                        LISTA ENVIADA COM SUCESSO
                                    </span>

                                    <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                                        {listName}
                                    </h2>

                                    {/* Área de Nomes com Desfoque Realista */}
                                    <div className="relative h-20 mb-6 overflow-hidden mask-fade">
                                        <div className="flex flex-col items-center gap-1 blur-[6px] opacity-30 select-none pointer-events-none transform scale-105">
                                            {getParsedData().map((item, i) => (
                                                <div key={i} className="text-sm font-medium text-indigo-900 tracking-tight">
                                                    {item.name} - {item.doc}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 via-transparent to-indigo-50/80"></div>
                                    </div>

                                    {/* Ações de Download/Partilha */}
                                    <div className="flex justify-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl text-indigo-600 font-semibold shadow-sm hover:bg-indigo-600 hover:text-white transition-all border border-indigo-50">
                                            <Download size={18} />
                                            <span className="text-xs">Baixar</span>
                                        </button>
                                        <button className="p-2.5 bg-white rounded-xl text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-all border border-indigo-50">
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Ações Simplificadas */}
                                <div className="flex flex-col items-center">
                                    <button onClick={handleReset} className="flex items-center justify-center gap-2 py-2 text-slate-400 font-semibold hover:text-slate-900 transition-all group">
                                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                        Voltar ao início
                                    </button>
                                </div>

                                {/* Footer / Info Adicional */}
                                <div className="mt-10 pt-8 border-t border-slate-100">
                                    <p className="text-slate-400 text-[11px] font-medium uppercase tracking-tighter opacity-70">
                                        Processado em 10s • ID: #{Math.random().toString(36).substring(2, 8).toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SocialProof;
