import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, RefreshCw } from "lucide-react";
import CurrencySelect from "./CurrencySelect";

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState("KSH");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("10000");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    try {
      // Using exchangerate-api.com free tier
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      const rate = data.rates[toCurrency];
      setExchangeRate(rate);
      
      const numAmount = parseFloat(amount) || 0;
      setConvertedAmount(numAmount * rate);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchExchangeRate, 30000);
    return () => clearInterval(interval);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate) {
      const numAmount = parseFloat(amount) || 0;
      setConvertedAmount(numAmount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Real-time FX Converter
          </h1>
          <p className="text-muted-foreground">
            Convert currencies instantly with up-to-date market rates
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            Realtime
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Secure
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Choose currencies and enter an amount to see the live conversion
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end mb-8">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">From</label>
          <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
            <CurrencySelect
              value={fromCurrency}
              onChange={setFromCurrency}
            />
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-2xl font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="10,000"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSwapCurrencies}
          className="mb-2 rounded-full bg-primary/10 hover:bg-primary/20"
        >
          <ArrowDownUp className="h-5 w-5 text-primary" />
        </Button>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">To</label>
          <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
            <CurrencySelect
              value={toCurrency}
              onChange={setToCurrency}
            />
            <div className="flex-1 text-2xl font-semibold text-foreground">
              {convertedAmount !== null
                ? convertedAmount.toFixed(2)
                : "Converted"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-6 mb-8">
        <div className="text-3xl font-bold text-primary mb-2">
          {toCurrency} {convertedAmount?.toFixed(2) || "0.00"}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            1 {fromCurrency} = {exchangeRate?.toFixed(6) || "0.000000"} {toCurrency}
          </span>
          <span>Last updated {getTimeSinceUpdate()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-foreground mb-3">Rate trend (24h)</h3>
          <div className="h-40 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Simple sparkline preview for quick glance
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Details</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Mid-market rate. No hidden fees. Values update in real-time.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchExchangeRate}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button>Save conversion</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrencyConverter;
