import { OptionsPanel } from "@/components/OptionsPanel";

const Options = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Options Calculator</h1>
        <p className="text-muted-foreground">Advanced options pricing with Greeks analysis</p>
      </div>

      <OptionsPanel 
        bias="CALL"
        delta={0.65}
        expiry="2024-12-29"
        ivr={45}
        recommendation={{
          type: "Call Debit Spread",
          strike: 48000,
          premium: 450,
        }}
        riskReward={2.5}
      />
    </div>
  );
};

export default Options;
