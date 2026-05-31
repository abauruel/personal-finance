import { ArrowLeftRight, Send, Download, MoreHorizontal } from 'lucide-react';

export type ActionType = 'convert' | 'send' | 'receive' | 'more';

interface QuickActionButtonsProps {
  onAction?: (action: ActionType) => void;
}

export function QuickActionButtons({ onAction }: QuickActionButtonsProps) {
  const actions = [
    {
      type: 'convert' as ActionType,
      icon: ArrowLeftRight,
      label: 'Convert',
      color: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      type: 'send' as ActionType,
      icon: Send,
      label: 'Send',
      color: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      type: 'receive' as ActionType,
      icon: Download,
      label: 'Receive',
      color: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      type: 'more' as ActionType,
      icon: MoreHorizontal,
      label: 'More',
      color: 'bg-gray-50 hover:bg-gray-100',
      iconColor: 'text-gray-600',
    },
  ];

  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      {actions.map((action) => (
        <button
          key={action.type}
          onClick={() => onAction?.(action.type)}
          className="flex flex-col items-center gap-2 group"
          aria-label={action.label}
        >
          <div
            className={`w-14 h-14 rounded-full ${action.color} flex items-center justify-center transition-all group-hover:scale-105`}
          >
            <action.icon className={`w-6 h-6 ${action.iconColor}`} />
          </div>
          <span className="text-xs font-medium text-gray-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
