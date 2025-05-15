import React, { useEffect, useState } from 'react';

interface MessageProps {
  message: string | null;
  type?: 'info' | 'success' | 'error';
  duration?: number;
}

const Message: React.FC<MessageProps> = ({
  message,
  type = 'info',
  duration = 2000
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!message) return null;

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div
      className={`
        fixed top-20 left-1/2 transform -translate-x-1/2
        py-2 px-4 rounded shadow-lg z-50
        transition-opacity duration-300
        ${getTypeClasses()}
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {message}
    </div>
  );
};

export default Message; 