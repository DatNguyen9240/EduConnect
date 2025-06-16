import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select/index';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  label: string;
  value: string;
  placeholder?: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  minWidth?: string;
}

interface FilterGroupProps {
  filters: FilterConfig[];
}

export function FilterGroup({ filters }: FilterGroupProps) {
  return (
    <div className="flex items-center gap-4">
      {filters.map((filter) => (
        <div
          key={filter.label}
          className={`flex items-center gap-2 min-w-[${filter.minWidth ?? '120px'}]`}
        >
          <span className="text-sm">{filter.label}</span>
          <Select value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className={`min-w-[${filter.minWidth ?? '60px'}]`}>
              <SelectValue placeholder={filter.placeholder || filter.options[0]?.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
