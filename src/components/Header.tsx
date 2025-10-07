import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            FX
          </div>
          <span className="text-lg font-semibold text-foreground">Realtime FX</span>
        </div>
        
        <nav className="flex items-center gap-8">
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
          <a href="#status" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Status
          </a>
          <Button className="shadow-sm">
            Sign up for API key
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
