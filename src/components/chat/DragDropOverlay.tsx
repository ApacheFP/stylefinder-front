import { Paperclip } from 'lucide-react';

const DragDropOverlay = () => {
  return (
    <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center transition-all duration-200 pointer-events-none">
      <div className="bg-cream-100 rounded-2xl p-8 shadow-2xl border-2 border-primary border-dashed transform scale-100 transition-transform duration-200">
        <div className="text-center">
          <Paperclip className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-roboto font-bold text-text-dark mb-2">
            Drop your image here
          </h3>
          <p className="text-text-medium font-inter">
            Supported formats: JPEG, PNG, WebP (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DragDropOverlay;
