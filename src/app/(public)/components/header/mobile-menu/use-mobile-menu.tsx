import { useEffect, useState } from 'react';

export const useMobileMenu = () => {
  const [visible, setVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        setVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      setExpandedItems({});
    };
  }, [visible]);

  const toggleSubLinks = (itemId: string) => {
   setExpandedItems((prev) => ({
    ...Object.keys(prev).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>),
    [itemId]: !prev[itemId],
   }));
  };

  return {
    visible,
    setVisible,
    expandedItems,
    toggleSubLinks,
  };
};
