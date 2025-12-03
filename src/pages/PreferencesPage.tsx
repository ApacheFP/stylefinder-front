import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import PreferencesSkeleton from '../components/ui/PreferencesSkeleton';
import SearchableMultiSelect from '../components/ui/SearchableMultiSelect';
import { preferencesService } from '../services/preferencesService';
import type { AllPreferencesResponse } from '../services/preferencesService';
import { showToast } from '../utils/toast';
import { triggerSuccessConfetti } from '../utils/confetti';

// Soglia per mostrare dropdown invece di bottoni
const DROPDOWN_THRESHOLD = 10;

// Preferenze a selezione singola (es. Genere)
const SINGLE_SELECT_PREFERENCES = ['Genere', 'gender', 'Gender'];

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
    return <PreferencesSkeleton />;
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
                          className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-all duration-200 border-2 ${isSelected
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
                          className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-all duration-200 border-2 ${isSelected
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
