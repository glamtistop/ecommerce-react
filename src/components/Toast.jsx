import { useEffect } from 'react';

export default function Toast({ message, isVisible, onHide, duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-[#034F24] text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
        <span className="mr-2">✓</span>
        {message}
      </div>
    </div>
  );
}
