import React from 'react';

type BadgeVariant = 'blue' | 'red' | 'green' | 'yellow' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  blue:   'bg-blue-50 text-blue-700 border border-blue-200',
  red:    'bg-red-50 text-red-700 border border-red-200',
  green:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  gray:   'bg-gray-100 text-gray-600 border border-gray-200',
};

const Badge: React.FC<BadgeProps> = ({ label, variant = 'gray' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {label}
    </span>
  );
};

export default Badge;