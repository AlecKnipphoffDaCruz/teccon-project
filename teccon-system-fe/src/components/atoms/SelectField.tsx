import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  error?: string;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  options,
  error,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      <select
        className={`
          w-full h-12 rounded-xl border border-gray-200 bg-gray-50
          px-4 pr-10 text-sm text-gray-800 font-medium
          outline-none transition-all duration-200 appearance-none cursor-pointer
          focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10
          ${error ? 'border-red-400' : ''}
          ${!props.value ? 'text-gray-400' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Chevron */}
      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
      {error && <span className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default SelectField;