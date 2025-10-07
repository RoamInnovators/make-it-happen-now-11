import Header from "@/components/Header";
import CurrencyConverter from "@/components/CurrencyConverter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <CurrencyConverter />
      </main>
    </div>
  );
};

export default Index;
