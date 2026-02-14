import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Excluir Registro?",
    description = "Esta ação é irreversível. O registro será removido permanentemente do sistema.",
    confirmLabel = "Confirmar Exclusão",
    cancelLabel = "Cancelar"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10 border-t-8 border-rose-500 animate-in zoom-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 text-rose-500">
                        <Trash2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        {description.split('irreversível').map((part, i, arr) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <span className="text-rose-600 font-bold uppercase tracking-wider text-xs">irreversível</span>
                                )}
                            </React.Fragment>
                        ))}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {confirmLabel}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all"
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
