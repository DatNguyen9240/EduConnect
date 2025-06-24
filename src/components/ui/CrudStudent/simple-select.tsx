'use client';

import React from 'react';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface SimpleSelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}

export function SimpleSelect({
  value,
  onValueChange,
  placeholder,
  children,
  className,
  disabled,
}: SimpleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');

  const handleSelect = (itemValue: string) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
    setIsOpen(false);
  };

  // Get display text from selected item
  const getDisplayText = () => {
    if (!selectedValue) return placeholder || 'Chọn...';

    // Find the selected item text from children
    const items = React.Children.toArray(children) as React.ReactElement<SimpleSelectItemProps>[];
    const selectedItem = items.find(
      (item) => (item as React.ReactElement<SimpleSelectItemProps>).props.value === selectedValue
    );
    return selectedItem ? (selectedItem.props as SimpleSelectItemProps).children : selectedValue;
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedValue ? 'text-gray-900' : 'text-gray-500'}>
          {getDisplayText()}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<SimpleSelectItemProps>, {
                  onSelect: handleSelect,
                });
              }
              return child;
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function SimpleSelectItem({ value, children, onSelect }: SimpleSelectItemProps) {
  return (
    <div
      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  );
}
