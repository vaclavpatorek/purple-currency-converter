// Response type for exchange rates endpoint
export interface ExchangeRatesResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Response type for currency conversion endpoint
export interface ConversionResponse {
  result: number;
}

// Response type for statistics endpoint
export interface StatisticsResponse {
  totalConversions: number;
  mostUsedTargetCurrency: string;
  totalInUSD: number;
} 