import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { preferencesService } from '../services/preferencesService';
import { showToast } from '../utils/toast';

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);

  // Nuove opzioni dinamiche
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  // Usa Record<string, any> per gestire preferenze dinamiche
  const [preferences, setPreferences] = useState<Record<string, any>>({});

  // Lista preferenze dinamiche
  const [allPreferences, setAllPreferences] = useState<Array<{ id: number; name: string }>>([]);

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

  // Gestione dinamica dei campi
  const handlePrefChange = (prefName: string, value: string | string[]) => {
    setPreferences((prev) => ({ ...prev, [prefName]: value }));
  };

  const handleGenderChange = (gender: 'man' | 'woman' | 'non-binary') => {
    setPreferences({ ...preferences, gender });
  };



  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await preferencesService.updatePreferences(preferences);
      if (success) {
        showToast.success('Preferences saved!');
        navigate('/chat');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-6 md:mb-8">
          Your Preferences
        </h1>

        {/* Gender Section */}
        {allPreferences.find(p => p.name === 'gender') && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Gender</h2>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {(['man', 'woman', 'non-binary'] as const).map((gender) => {
                const isSelected = preferences['gender'] === gender;
                return (
                  <button
                    key={gender}
                    onClick={() => handlePrefChange('gender', gender)}
                    className={`px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-200 border-2 ${isSelected
                      ? 'bg-primary/10 border-primary text-primary dark:text-primary-light'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    <span className="capitalize">{gender}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Styles Section */}
        {allPreferences.some(p => p.name && typeof p.name === 'string' && p.name.startsWith('style_')) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Favorite Styles</h2>
            <div className="flex flex-wrap gap-2">
              {allPreferences
                .filter(p => p.name && typeof p.name === 'string' && p.name.startsWith('style_'))
                .map(pref => {
                  const style = pref.name.replace('style_', '');
                  const isSelected = preferences[pref.name] === 'true' || preferences[pref.name] === true;
                  return (
                    <button
                      key={pref.id}
                      onClick={() => handlePrefChange(pref.name, isSelected ? 'false' : 'true')}
                      className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-colors active:scale-95 ${isSelected
                        ? 'bg-blue-100 dark:bg-primary/20 text-primary dark:text-primary-light border-2 border-primary'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Colors Section */}
        {allPreferences.some(p => p.name && typeof p.name === 'string' && p.name.startsWith('color_')) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Favorite Colors</h2>
            <div className="flex flex-wrap gap-2">
              {allPreferences
                .filter(p => p.name && typeof p.name === 'string' && p.name.startsWith('color_'))
                .map(pref => {
                  const color = pref.name.replace('color_', '');
                  const isSelected = preferences[pref.name] === 'true' || preferences[pref.name] === true;
                  return (
                    <button
                      key={pref.id}
                      onClick={() => handlePrefChange(pref.name, isSelected ? 'false' : 'true')}
                      className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-colors active:scale-95 ${isSelected
                        ? 'bg-blue-100 dark:bg-primary/20 text-primary dark:text-primary-light border-2 border-primary'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Brands Section */}
        {allPreferences.some(p => p.name && typeof p.name === 'string' && p.name.startsWith('brand_')) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Favorite Brands</h2>
            <div className="flex flex-wrap gap-2">
              {allPreferences
                .filter(p => p.name && typeof p.name === 'string' && p.name.startsWith('brand_'))
                .map(pref => {
                  const brand = pref.name.replace('brand_', '');
                  const isSelected = preferences[pref.name] === 'true' || preferences[pref.name] === true;
                  return (
                    <button
                      key={pref.id}
                      onClick={() => handlePrefChange(pref.name, isSelected ? 'false' : 'true')}
                      className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-colors active:scale-95 ${isSelected
                        ? 'bg-blue-100 dark:bg-primary/20 text-primary dark:text-primary-light border-2 border-primary'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {brand.charAt(0).toUpperCase() + brand.slice(1)}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Other Preferences */}
        {allPreferences.some(p => p.name && typeof p.name === 'string' &&
          !p.name.startsWith('style_') &&
          !p.name.startsWith('color_') &&
          !p.name.startsWith('brand_') &&
          p.name !== 'gender') && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Other Preferences</h2>
              {allPreferences
                .filter(p => p.name && typeof p.name === 'string' &&
                  !p.name.startsWith('style_') &&
                  !p.name.startsWith('color_') &&
                  !p.name.startsWith('brand_') &&
                  p.name !== 'gender')
                .map(pref => (
                  <div key={pref.id} className="mb-4">
                    <label className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">{pref.name}</label>
                    <input
                      type="text"
                      value={typeof preferences[pref.name] === 'string' ? preferences[pref.name] : ''}
                      onChange={e => handlePrefChange(pref.name, e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                    />
                  </div>
                ))}
            </div>
          )}

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
