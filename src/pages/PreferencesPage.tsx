import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserPreferences } from '../types';
import Button from '../components/ui/Button';
import { preferencesService } from '../services/preferencesService';
import { showToast } from '../utils/toast';

const STYLES = ['Casual', 'Elegant', 'Sporty', 'Streetwear', 'Minimalist', 'Vintage', 'Boho'];
const COLORS = ['Black', 'Blue', 'White', 'Gray', 'Beige', 'Green'];

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: 'man',
    favoriteStyles: [],
    favoriteColors: [],
  });

  // Load existing preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoadingPrefs(true);
        const existingPrefs = await preferencesService.getPreferences();
        if (existingPrefs) {
          setPreferences({
            gender: existingPrefs.gender || 'man',
            favoriteStyles: existingPrefs.favoriteStyles || [],
            favoriteColors: existingPrefs.favoriteColors || [],
          });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoadingPrefs(false);
      }
    };
    loadPreferences();
  }, []);

  const handleGenderChange = (gender: 'man' | 'woman' | 'non-binary') => {
    setPreferences({ ...preferences, gender });
  };

  const toggleStyle = (style: string) => {
    const styles = preferences.favoriteStyles.includes(style)
      ? preferences.favoriteStyles.filter(s => s !== style)
      : [...preferences.favoriteStyles, style];
    setPreferences({ ...preferences, favoriteStyles: styles });
  };

  const toggleColor = (color: string) => {
    const colors = preferences.favoriteColors.includes(color)
      ? preferences.favoriteColors.filter(c => c !== color)
      : [...preferences.favoriteColors, color];
    setPreferences({ ...preferences, favoriteColors: colors });
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 md:mb-8">
          Your Preferences
        </h1>

        {/* Gender Selection */}
        <div className="mb-6 md:mb-8">
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-3">
            Gender
          </label>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {(['man', 'woman', 'non-binary'] as const).map((gender) => (
              <label key={gender} className="flex items-center cursor-pointer min-h-[44px] min-w-[44px]">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={preferences.gender === gender}
                  onChange={() => handleGenderChange(gender)}
                  className="mr-2 w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="capitalize text-sm md:text-base">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Favorite Styles */}
        <div className="mb-6 md:mb-8">
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-3">
            Favorite Styles
          </label>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-colors active:scale-95 ${
                  preferences.favoriteStyles.includes(style)
                    ? 'bg-blue-100 text-primary border-2 border-primary'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Colors */}
        <div className="mb-6 md:mb-8">
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-3">
            Favorite Colors
          </label>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`px-4 py-2 min-h-[44px] rounded-full text-sm md:text-base font-medium transition-colors active:scale-95 ${
                  preferences.favoriteColors.includes(color)
                    ? 'bg-blue-100 text-primary border-2 border-primary'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

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
