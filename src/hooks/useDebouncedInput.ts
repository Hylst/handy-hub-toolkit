
import { useState, useEffect, useRef } from 'react';

export const useDebouncedInput = (initialValue: string = '', delay: number = 300) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, delay]);

  const handleInputChange = (value: string) => {
    // Validation pour n'accepter que les nombres et points/virgules
    const sanitized = value.replace(/[^0-9.,-]/g, '').replace(',', '.');
    setInputValue(sanitized);
  };

  const resetInput = () => {
    setInputValue('');
    setDebouncedValue('');
  };

  return {
    inputValue,
    debouncedValue,
    handleInputChange,
    resetInput,
    setInputValue
  };
};
