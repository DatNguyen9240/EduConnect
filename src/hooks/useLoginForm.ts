import { useState, useEffect } from 'react';

export const useShowForm = (delay: number = 100) => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, delay);
  }, [delay]);

  return showForm;
};
