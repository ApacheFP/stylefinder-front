import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

interface SearchableMultiSelectProps {
    values: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
    placeholder: string;
}

const SearchableMultiSelect = ({
    values,
    selectedValues,
    onToggle,
    placeholder,
}: SearchableMultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredValues = values.filter(v =>
        v.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Selected tags */}
            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {selectedValues.map(value => (
                        <span
                            key={value}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary dark:text-primary-light rounded-full text-sm font-medium"
                        >
                            <span className="capitalize">{value}</span>
                            <button
                                onClick={() => onToggle(value)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-primary/50 transition-all duration-200"
            >
                <span className="text-gray-500 dark:text-gray-400">
                    {placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-72 overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options list */}
                    <div className="overflow-y-auto max-h-52">
                        {filteredValues.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                                No results found
                            </div>
                        ) : (
                            filteredValues.map(value => {
                                const isSelected = selectedValues.includes(value);
                                return (
                                    <button
                                        key={value}
                                        onClick={() => onToggle(value)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${isSelected
                                                ? 'bg-primary/10 text-primary dark:text-primary-light'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <span className="capitalize">{value}</span>
                                        {isSelected && <span className="float-right">✓</span>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableMultiSelect;
