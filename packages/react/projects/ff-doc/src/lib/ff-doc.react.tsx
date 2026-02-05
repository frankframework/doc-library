import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { FFDoc } from '@frankframework/doc-library-core';
import type { Elements, FFDocJson, Filters } from '@frankframework/doc-library-core';

type FFDocContextProvider = {
  ffDoc: FFDocJson | null;
  elements: Elements | null;
  filters: Filters | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const FFDocContext = createContext<FFDocContextProvider | null>(null);

export function FFDocProvider({ children, jsonUrl }: { children: ReactNode, jsonUrl: string }) {
  const [ffDocJson, setFfDocJson] = useState<FFDocJson | null>(null);
  const [elements, setElements] = useState<Elements | null>(null);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const ffDoc = new FFDoc();

  const loadFrankDoc = () => {
    setIsLoading(true);
    setError(null);

    ffDoc
      .initialize(jsonUrl)
      .then(() => {
        setFfDocJson(ffDoc.ffDoc);
        setFilters(ffDoc.filters);
        setElements(ffDoc.elements);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadFrankDoc();
  }, []);

  return (
    <FFDocContext.Provider value={{ ffDoc: ffDocJson, elements, filters, isLoading, error, refetch: loadFrankDoc }}>
      { children }
    </FFDocContext.Provider>
  );
}

export function useFFDoc(): FFDocContextProvider {
  const context = useContext(FFDocContext);
  if (!context) {
    throw new Error('useFFDoc must be used within a FFDocProvider context');
  }
  return context;
}
