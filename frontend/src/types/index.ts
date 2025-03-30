// Data definition from Fixer API
export interface CurrencyData {
    success: boolean;
    timestamp: number;
    base: string;
    date: string;
    rates: Record<string, number>;
}

// List of currencies and their codes
export interface CurrencyList {
    success: boolean;
    symbols: Record<string, string>;
}

// Currency conversion result
export interface ConversionResult {
    amount: number;
    from: string;
    to: string;
    result: number;
    date: string;
}