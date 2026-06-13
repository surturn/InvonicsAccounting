import React, { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export function Select({
  className,
  label,
  error,
  options,
  placeholder,
  id,
  ...props
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label htmlFor={selectId} className="text-text-secondary text-sm mb-1 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full bg-bg-elevated border rounded-lg px-3 py-2 pr-10 text-text-primary appearance-none transition-colors focus:outline-none focus:ring-2',
            error
              ? 'border-danger focus:ring-danger focus:border-danger'
              : 'border-bg-border focus:ring-accent focus:border-transparent',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <span className="text-danger text-xs mt-1">{error}</span>}
    </div>
  );
}
