// Data definition from Fixer API
export interface CurrencyData {
    success: boolean;
    timestamp: number;
    base: string;
    date: string;
    rates: Record<string, number>;
}

// Currency conversion request
export type CurrencyList = string[];

// Currency conversion result
export interface ConversionResult {
    amount: number;
    from: string;
    to: string;
    result: number;
}