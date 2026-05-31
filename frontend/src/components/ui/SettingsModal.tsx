import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Globe, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './Button';
import { useSettings } from '../../contexts/SettingsContext';
import { CURRENCIES, LOCALES } from '../../types/settings.types';
import { formatCurrency } from '../../lib/formatters';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(tempSettings);
    toast.success('Configurações salvas com sucesso!');
    onClose();
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja redefinir todas as configurações para os valores padrão?')) {
      resetSettings();
      setTempSettings(settings);
      toast.success('Configurações redefinidas!');
    }
  };

  const handleClose = () => {
    setTempSettings(settings);
    onClose();
  };

  // Example value for preview
  const exampleValue = 1234.56;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    Configurações
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Currency Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <label className="text-sm font-semibold text-gray-900">
                        Moeda
                      </label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.values(CURRENCIES).map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => setTempSettings({ ...tempSettings, currency: curr.code })}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${tempSettings.currency === curr.code
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{curr.symbol}</span>
                            <span className="font-bold text-gray-900">{curr.code}</span>
                          </div>
                          <p className="text-xs text-gray-600">{curr.name}</p>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Prévia:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(exampleValue, tempSettings.currency, tempSettings.locale)}
                      </p>
                    </div>
                  </div>

                  {/* Locale Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <label className="text-sm font-semibold text-gray-900">
                        Idioma / Região
                      </label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.values(LOCALES).map((loc) => (
                        <button
                          key={loc.code}
                          onClick={() => setTempSettings({ ...tempSettings, locale: loc.code })}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${tempSettings.locale === loc.code
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{loc.flag}</span>
                            <span className="font-bold text-gray-900">{loc.code}</span>
                          </div>
                          <p className="text-xs text-gray-600">{loc.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Format */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <label className="text-sm font-semibold text-gray-900">
                        Formato de Data
                      </label>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] as const).map((format) => (
                        <button
                          key={format}
                          onClick={() => setTempSettings({ ...tempSettings, dateFormat: format })}
                          className={`p-3 rounded-xl border-2 transition-all ${tempSettings.dateFormat === format
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <p className="text-sm font-medium text-gray-900">{format}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* First Day of Week */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Primeiro Dia da Semana
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTempSettings({ ...tempSettings, firstDayOfWeek: 0 })}
                        className={`p-3 rounded-xl border-2 transition-all ${tempSettings.firstDayOfWeek === 0
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <p className="text-sm font-medium text-gray-900">Domingo</p>
                      </button>
                      <button
                        onClick={() => setTempSettings({ ...tempSettings, firstDayOfWeek: 1 })}
                        className={`p-3 rounded-xl border-2 transition-all ${tempSettings.firstDayOfWeek === 1
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <p className="text-sm font-medium text-gray-900">Segunda-feira</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Redefinir
                  </Button>
                  <div className="flex-1" />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSave}
                  >
                    Salvar
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
