import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserPreferences } from '../types';
import Button from '../components/ui/Button';

const STYLES = ['Casual', 'Elegant', 'Sporty', 'Streetwear', 'Minimalist', 'Vintage', 'Boho'];
const COLORS = ['Black', 'Blue', 'White', 'Gray', 'Beige', 'Green'];

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: 'man',
    favoriteStyles: [],
    favoriteColors: [],
  });

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
      // TODO: Save preferences to backend
      console.log('Saving preferences:', preferences);
      navigate('/chat');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Your Preferences
        </h1>

        {/* Gender Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Gender
          </label>
          <div className="flex gap-4">
            {(['man', 'woman', 'non-binary'] as const).map((gender) => (
              <label key={gender} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={preferences.gender === gender}
                  onChange={() => handleGenderChange(gender)}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="capitalize">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Favorite Styles */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Favorite Styles
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Favorite Colors
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
        <div className="flex gap-4">
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
