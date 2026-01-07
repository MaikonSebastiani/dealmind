"use client";

import { useState, useCallback } from "react";
import { 
  fetchAddressByCEP, 
  isValidCEP, 
  cleanCEP,
  type AddressData 
} from "@/lib/services/viacep";
import { useLocale } from "@/contexts/locale-context";

interface UseAddressLookupOptions {
  onSuccess?: (address: AddressData) => void;
  onError?: (error: string) => void;
}

interface UseAddressLookupReturn {
  lookup: (cep: string) => Promise<AddressData | null>;
  isLoading: boolean;
  error: string | null;
  address: AddressData | null;
  clearAddress: () => void;
  isSupported: boolean; // Only supported for Brazilian locale
}

/**
 * Hook for address lookup by ZIP code
 * Currently supports Brazilian CEP via ViaCEP API
 * Returns isSupported=false for other locales (can be extended later)
 */
export function useAddressLookup(
  options: UseAddressLookupOptions = {}
): UseAddressLookupReturn {
  const { locale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);

  // Only Brazilian locale is supported for now
  const isSupported = locale === "pt-BR";

  const lookup = useCallback(
    async (cep: string): Promise<AddressData | null> => {
      // Skip if not Brazilian locale
      if (!isSupported) {
        return null;
      }

      const cleanedCEP = cleanCEP(cep);

      // Skip if CEP is not complete
      if (!isValidCEP(cleanedCEP)) {
        setError(null);
        setAddress(null);
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchAddressByCEP(cleanedCEP);

        if (result.success) {
          setAddress(result.data);
          setError(null);
          options.onSuccess?.(result.data);
          return result.data;
        } else {
          setError(result.error);
          setAddress(null);
          options.onError?.(result.error);
          return null;
        }
      } catch (err) {
        const errorMessage = "Erro ao buscar endereço";
        setError(errorMessage);
        setAddress(null);
        options.onError?.(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported, options]
  );

  const clearAddress = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  return {
    lookup,
    isLoading,
    error,
    address,
    clearAddress,
    isSupported,
  };
}

