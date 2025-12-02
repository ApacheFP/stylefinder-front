import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, ChevronDown, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { preferencesService } from '../services/preferencesService';
import type { AllPreferencesResponse } from '../services/preferencesService';
import { showToast } from '../utils/toast';
import { triggerSuccessConfetti } from '../utils/confetti';

// Soglia per mostrare dropdown invece di bottoni
const DROPDOWN_THRESHOLD = 10;

// Preferenze a selezione singola (es. Genere)
const SINGLE_SELECT_PREFERENCES = ['Genere', 'gender', 'Gender'];

// Componente dropdown con ricerca e selezione multipla
const SearchableMultiSelect = ({
  values,
  selectedValues,
  onToggle,
  placeholder,
}: {
  values: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Chiudi dropdown quando si clicca fuori
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
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isSelected
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

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);

  // Preferenze dell'utente: { "Brand": "h&m,zara", "Genere": "male" }
  const [preferences, setPreferences] = useState<Record<string, string>>({});

  // Tutte le preferenze disponibili con i loro valori possibili
  const [allPreferences, setAllPreferences] = useState<AllPreferencesResponse>({});

  // Calculate selected preferences count (conta i valori totali selezionati)
  const selectedCount = Object.values(preferences)
    .flatMap(v => preferencesService.parseMultiValue(v))
    .length;

  // Load existing preferences and available options on mount
  useEffect(() => {
    const loadPreferencesAndOptions = async () => {
      try {
        setIsLoadingPrefs(true);
        const [existingPrefs, allPrefs] = await Promise.all([
          preferencesService.getPreferences(),
          preferencesService.getAllPreferences()
        ]);
        if (existingPrefs) {
          setPreferences(existingPrefs);
        }
        setAllPreferences(allPrefs);
      } catch (error) {
        console.error('Failed to load preferences/options:', error);
      } finally {
        setIsLoadingPrefs(false);
      }
    };
    loadPreferencesAndOptions();
  }, []);

  // Gestione toggle multiplo per una preferenza
  const handleToggleValue = (prefName: string, value: string) => {
    setPreferences((prev) => {
      const currentValues = preferencesService.parseMultiValue(prev[prefName]);
      const isSelected = currentValues.includes(value);
      
      let newValues: string[];
      if (isSelected) {
        // Rimuovi il valore
        newValues = currentValues.filter(v => v !== value);
      } else {
        // Aggiungi il valore
        newValues = [...currentValues, value];
      }
      
      return { ...prev, [prefName]: preferencesService.joinMultiValue(newValues) };
    });
  };

  // Gestione selezione singola (es. Genere)
  const handleSingleSelect = (prefName: string, value: string) => {
    setPreferences((prev) => {
      // Se già selezionato, deseleziona
      if (prev[prefName] === value) {
        return { ...prev, [prefName]: '' };
      }
      // Altrimenti seleziona (sovrascrive il precedente)
      return { ...prev, [prefName]: value };
    });
  };

  // Gestione input testo per preferenze libere
  const handleTextChange = (prefName: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [prefName]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await preferencesService.updatePreferences(preferences);
      if (success) {
        triggerSuccessConfetti();
        showToast.success('Preferences saved!');
        setTimeout(() => {
          navigate('/chat');
        }, 500);
      } else {
        showToast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/chat');
  };

  // Show loading while fetching existing preferences
  if (isLoadingPrefs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <Skeleton className="w-48 h-8 mx-auto mb-4" />
          </div>

          {/* Preference skeletons */}
          {[1, 2, 3].map(i => (
            <div key={i} className="mb-8">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(j => (
                  <Skeleton key={j} className="w-24 h-10 rounded-full" />
                ))}
              </div>
            </div>
          ))}

          {/* Buttons skeleton */}
          <div className="flex gap-4">
            <Skeleton className="flex-1 h-12" />
            <Skeleton className="flex-1 h-12" />
          </div>
        </div>
      </div>
    );
  }

  // Ordina le preferenze per ID
  const sortedPreferences = Object.entries(allPreferences).sort(([idA], [idB]) => Number(idA) - Number(idB));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Your Preferences
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Personalize your StyleFinder experience
        </p>

        {!isLoadingPrefs && sortedPreferences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Unable to load preferences options. Please try again later.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Preferences Summary Card */}
        {selectedCount > 0 && (
          <div className="mb-6 p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary dark:text-primary-light" />
              <p className="text-sm font-medium text-primary dark:text-primary-light">
                {selectedCount} preference{selectedCount !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
        )}

        {/* Render each preference section */}
        {sortedPreferences.map(([prefId, pref]) => {
          const selectedValues = preferencesService.parseMultiValue(preferences[pref.name]);
          const isSingleSelect = SINGLE_SELECT_PREFERENCES.includes(pref.name);
          
          return (
            <div key={prefId} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 capitalize">
                {pref.name}
              </h2>
              
              {pref.values && pref.values.length > 0 ? (
                // Usa dropdown con ricerca se i valori sono molti, altrimenti bottoni
                pref.values.length > DROPDOWN_THRESHOLD ? (
                  <SearchableMultiSelect
                    values={pref.values}
                    selectedValues={selectedValues}
                    onToggle={(value: string) => handleToggleValue(pref.name, value)}
                    placeholder={`Select ${pref.name.toLowerCase()}...`}
                  />
                ) : isSingleSelect ? (
                  // Selezione singola (es. Genere)
                  <div className="flex flex-wrap gap-2">
                    {pref.values.map((value) => {
                      const isSelected = preferences[pref.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => handleSingleSelect(pref.name, value)}
                          className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-all duration-200 border-2 ${
                            isSelected
                              ? 'bg-primary/10 border-primary text-primary dark:text-primary-light'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="capitalize">{value}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // Selezione multipla (es. Brand)
                  <div className="flex flex-wrap gap-2">
                    {pref.values.map((value) => {
                      const isSelected = selectedValues.includes(value);
                      return (
                        <button
                          key={value}
                          onClick={() => handleToggleValue(pref.name, value)}
                          className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-all duration-200 border-2 ${
                            isSelected
                              ? 'bg-primary/10 border-primary text-primary dark:text-primary-light'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="capitalize">{value}</span>
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                // Per preferenze senza valori predefiniti (es. colore, stile), usa un input di testo
                <input
                  type="text"
                  value={preferences[pref.name] || ''}
                  onChange={(e) => handleTextChange(pref.name, e.target.value)}
                  placeholder={`Enter your preferred ${pref.name.toLowerCase()}`}
                  className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                />
              )}
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleSave}
            isLoading={isLoading}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
