/**
 * ViaCEP Service
 * Free Brazilian ZIP code lookup API
 * https://viacep.com.br/
 */

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;      // Street
  complemento: string;     // Additional info
  unidade: string;         // Unit
  bairro: string;          // Neighborhood
  localidade: string;      // City
  uf: string;              // State (2 letters)
  estado: string;          // State (full name)
  regiao: string;          // Region
  ibge: string;            // IBGE code
  gia: string;             // GIA code
  ddd: string;             // Area code
  siafi: string;           // SIAFI code
  erro?: boolean;          // Error flag
}

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  stateCode: string;
  region: string;
  fullAddress: string;
}

export interface ViaCEPError {
  error: true;
  message: string;
}

export type ViaCEPResult = 
  | { success: true; data: AddressData }
  | { success: false; error: string };

/**
 * Cleans CEP string, removing non-numeric characters
 */
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, "");
}

/**
 * Validates if CEP has correct format (8 digits)
 */
export function isValidCEP(cep: string): boolean {
  const cleaned = cleanCEP(cep);
  return cleaned.length === 8;
}

/**
 * Fetches address data from ViaCEP API
 * @param cep - Brazilian ZIP code (with or without formatting)
 * @returns Address data or error
 */
export async function fetchAddressByCEP(cep: string): Promise<ViaCEPResult> {
  const cleanedCEP = cleanCEP(cep);

  // Validate CEP format
  if (!isValidCEP(cleanedCEP)) {
    return {
      success: false,
      error: "CEP inválido. Deve conter 8 dígitos.",
    };
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanedCEP}/json/`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Erro ao consultar CEP. Tente novamente.",
      };
    }

    const data: ViaCEPResponse = await response.json();

    // ViaCEP returns { erro: true } for invalid CEPs
    if (data.erro) {
      return {
        success: false,
        error: "CEP não encontrado.",
      };
    }

    // Build full address
    const addressParts = [
      data.logradouro,
      data.bairro,
      `${data.localidade} - ${data.uf}`,
    ].filter(Boolean);

    return {
      success: true,
      data: {
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.estado || "",
        stateCode: data.uf || "",
        region: data.regiao || "",
        fullAddress: addressParts.join(", "),
      },
    };
  } catch (error) {
    console.error("ViaCEP fetch error:", error);
    return {
      success: false,
      error: "Erro de conexão. Verifique sua internet.",
    };
  }
}

