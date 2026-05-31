import { Plus, CreditCard } from 'lucide-react';
import { QuickActionButtons, type ActionType } from './QuickActionButtons';

interface PaymentCard {
  id: string;
  lastFourDigits: string;
  brand: 'VISA' | 'MASTERCARD' | 'AMEX';
  expiryDate?: string;
  holderName: string;
  isDefault?: boolean;
}

interface MyCardsSectionProps {
  cards: PaymentCard[];
  onAddCard?: () => void;
  onAction?: (action: ActionType) => void;
}

export function MyCardsSection({ cards, onAddCard, onAction }: MyCardsSectionProps) {
  const getBrandLogo = (brand: string) => {
    // In a real app, these would be actual logo images
    switch (brand) {
      case 'VISA':
        return 'VISA';
      case 'MASTERCARD':
        return 'MC';
      case 'AMEX':
        return 'AMEX';
      default:
        return brand;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">My Cards</h3>
        <button
          onClick={onAddCard}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add card
        </button>
      </div>

      {/* Empty State */}
      {cards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cartão cadastrado</h4>
          <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
            Você ainda não possui cartões cadastrados. Adicione seu primeiro cartão para começar.
          </p>
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar cartão
          </button>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative h-48 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white overflow-hidden"
              >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white"></div>
                  <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white"></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Top Section */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs opacity-80 mb-1">{card.holderName}</p>
                      <p className="text-lg font-semibold">Exp {card.expiryDate}</p>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                      <p className="text-sm font-bold">{getBrandLogo(card.brand)}</p>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-white/60"></div>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-white/60"></div>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-white/60"></div>
                        ))}
                      </div>
                      <p className="text-lg font-bold tracking-wider">{card.lastFourDigits}</p>
                    </div>
                  </div>
                </div>

                {/* Contactless Icon */}
                <div className="absolute bottom-6 right-6 opacity-40">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 16c-2.5-1.5-3-5-3-5s.5-3.5 3-5" />
                    <path d="M13 16c2.5-1.5 3-5 3-5s-.5-3.5-3-5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6">
            <QuickActionButtons onAction={onAction} />
          </div>
        </>
      )}
    </div>
  );
}
