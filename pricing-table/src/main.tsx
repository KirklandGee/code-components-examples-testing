import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import PricingTable from "./components/PricingTable/PricingTable";
import "./components/PricingTable/PricingTable.css";

type ThemeVars = {
  "--background-primary": string;
  "--background-secondary": string;
  "--text-primary": string;
  "--text-secondary": string;
  "--border-color": string;
  "--accent-color": string;
  "--accent-text-color": string;
  "--border-radius": string;
};

const themes: Record<string, ThemeVars> = {
  light: {
    "--background-primary": "#ffffff",
    "--background-secondary": "#f5f5f5",
    "--text-primary": "#1a1a1a",
    "--text-secondary": "#737373",
    "--border-color": "#e5e5e5",
    "--accent-color": "#2563eb",
    "--accent-text-color": "#ffffff",
    "--border-radius": "8px",
  },
  dark: {
    "--background-primary": "#0a0a0a",
    "--background-secondary": "#1a1a1a",
    "--text-primary": "#fafafa",
    "--text-secondary": "#a3a3a3",
    "--border-color": "#2a2a2a",
    "--accent-color": "#3b82f6",
    "--accent-text-color": "#ffffff",
    "--border-radius": "8px",
  },
  brand: {
    "--background-primary": "#fef7f0",
    "--background-secondary": "#fde8d0",
    "--text-primary": "#1c1917",
    "--text-secondary": "#78716c",
    "--border-color": "#e7e5e4",
    "--accent-color": "#ea580c",
    "--accent-text-color": "#ffffff",
    "--border-radius": "12px",
  },
};

function App() {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "brand" | "custom">("light");
  const [customVars, setCustomVars] = useState<ThemeVars>(themes.light);

  const currentVars = activeTheme === "custom" ? customVars : themes[activeTheme];

  const handleThemeChange = (theme: "light" | "dark" | "brand" | "custom") => {
    setActiveTheme(theme);
    if (theme !== "custom") {
      setCustomVars(themes[theme]);
    }
  };

  const handleCustomVarChange = (key: keyof ThemeVars, value: string) => {
    setCustomVars((prev) => ({ ...prev, [key]: value }));
  };

  const pageBackground = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef3e8" : "#f9fafb";

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: pageBackground,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      padding: "40px 20px",
      transition: "background 0.3s ease"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ 
          background: activeTheme === "dark" ? "#1a1a1a" : "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ 
            margin: "0 0 16px 0", 
            fontSize: "24px", 
            fontWeight: "600",
            color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
          }}>
            PricingTable Component Preview
          </h1>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "14px", 
              fontWeight: "500",
              color: activeTheme === "dark" ? "#a3a3a3" : "#737373"
            }}>
              Theme:
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(["light", "dark", "brand", "custom"] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  style={{
                    padding: "8px 16px",
                    border: activeTheme === theme ? "2px solid #2563eb" : "1px solid #e5e5e5",
                    borderRadius: "6px",
                    background: activeTheme === theme ? "#eff6ff" : activeTheme === "dark" ? "#2a2a2a" : "#ffffff",
                    color: activeTheme === theme ? "#2563eb" : activeTheme === "dark" ? "#fafafa" : "#1a1a1a",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: activeTheme === theme ? "600" : "400",
                    textTransform: "capitalize",
                    transition: "all 0.2s ease"
                  }}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {activeTheme === "custom" && (
            <div style={{ 
              marginTop: "20px", 
              padding: "16px", 
              background: activeTheme === "dark" ? "#0a0a0a" : "#f9fafb",
              borderRadius: "8px",
              border: `1px solid ${activeTheme === "dark" ? "#2a2a2a" : "#e5e5e5"}`
            }}>
              <h3 style={{ 
                margin: "0 0 16px 0", 
                fontSize: "16px", 
                fontWeight: "600",
                color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
              }}>
                Custom Theme Editor
              </h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "12px" 
              }}>
                {Object.entries(customVars).map(([key, value]) => (
                  <div key={key}>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "4px", 
                      fontSize: "12px", 
                      fontWeight: "500",
                      color: activeTheme === "dark" ? "#a3a3a3" : "#737373"
                    }}>
                      {key}
                    </label>
                    <input
                      type={key === "--border-radius" ? "text" : "color"}
                      value={value}
                      onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                      style={{
                        width: "100%",
                        padding: key === "--border-radius" ? "6px 8px" : "4px",
                        border: `1px solid ${activeTheme === "dark" ? "#2a2a2a" : "#e5e5e5"}`,
                        borderRadius: "4px",
                        background: activeTheme === "dark" ? "#1a1a1a" : "#ffffff",
                        color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a",
                        fontSize: "14px",
                        cursor: "pointer"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              marginBottom: "24px",
              color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
            }}>
              Default Configuration
            </h2>
            <PricingTable
              id="pricing-default"
              layout="horizontal"
              heading="Choose Your Plan"
              subheading="Select the perfect plan for your needs"
              tier1Name="Basic"
              tier1Price="$9"
              tier1Period="/month"
              tier1Description="Perfect for getting started"
              tier1Features="Up to 5 projects\nBasic support\n1GB storage\nEmail notifications"
              tier1CtaText="Get Started"
              tier1CtaLink="#"
              tier1Visible={true}
              tier2Name="Professional"
              tier2Price="$29"
              tier2Period="/month"
              tier2Description="Most popular choice"
              tier2Features="Unlimited projects\nPriority support\n10GB storage\nAdvanced analytics\nTeam collaboration\nCustom integrations"
              tier2CtaText="Start Free Trial"
              tier2CtaLink="#"
              tier2Recommended={true}
              tier2Visible={true}
              tier3Name="Enterprise"
              tier3Price="$99"
              tier3Period="/month"
              tier3Description="For large organizations"
              tier3Features="Everything in Pro\nDedicated support\nUnlimited storage\nAdvanced security\nCustom workflows\nSLA guarantee"
              tier3CtaText="Contact Sales"
              tier3CtaLink="#"
              tier3Visible={true}
              badgeText="Most Popular"
              footerText="All plans include 24/7 support and 30-day money-back guarantee"
              showFooter={true}
            />
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              marginBottom: "24px",
              color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
            }}>
              Vertical Layout - Annual Billing
            </h2>
            <PricingTable
              id="pricing-vertical"
              layout="vertical"
              heading="Annual Plans"
              subheading="Save up to 20% with annual billing"
              tier1Name="Starter"
              tier1Price="$99"
              tier1Period="/year"
              tier1Description="Best for individuals"
              tier1Features="10 projects\nEmail support\n5GB storage\nBasic analytics"
              tier1CtaText="Start Now"
              tier1CtaLink="#"
              tier1Visible={true}
              tier2Name="Business"
              tier2Price="$299"
              tier2Period="/year"
              tier2Description="Perfect for teams"
              tier2Features="Unlimited projects\n24/7 support\n50GB storage\nAdvanced analytics\nAPI access\nWhite label"
              tier2CtaText="Try Free for 30 Days"
              tier2CtaLink="#"
              tier2Recommended={true}
              tier2Visible={true}
              tier3Name="Custom"
              tier3Price="Let's talk"
              tier3Period=""
              tier3Description="Tailored for your needs"
              tier3Features="Custom everything\nDedicated account manager\nUnlimited storage\nEnterprise SLA\nOn-premise option\nCustom contracts"
              tier3CtaText="Schedule Demo"
              tier3CtaLink="#"
              tier3Visible={true}
              badgeText="Best Value"
              footerText="All plans come with a 30-day money-back guarantee"
              showFooter={true}
            />
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              marginBottom: "24px",
              color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
            }}>
              Two Tiers Only - No Footer
            </h2>
            <PricingTable
              id="pricing-two-tier"
              layout="horizontal"
              heading="Simple Pricing"
              subheading="Choose the plan that works for you"
              tier1Name="Free"
              tier1Price="$0"
              tier1Period="/forever"
              tier1Description="Get started at no cost"
              tier1Features="3 projects\nCommunity support\n500MB storage\nBasic features"
              tier1CtaText="Sign Up Free"
              tier1CtaLink="#"
              tier1Visible={true}
              tier2Name="Premium"
              tier2Price="$49"
              tier2Period="/month"
              tier2Description="Unlock all features"
              tier2Features="Unlimited projects\nPriority support\n100GB storage\nAll features\nAdvanced integrations\nCustom branding"
              tier2CtaText="Upgrade Now"
              tier2CtaLink="#"
              tier2Recommended={false}
              tier2Visible={true}
              tier3Name="Enterprise"
              tier3Price="$99"
              tier3Period="/month"
              tier3Description="For large organizations"
              tier3Features="Everything in Pro\nDedicated support\nUnlimited storage"
              tier3CtaText="Contact Sales"
              tier3CtaLink="#"
              tier3Visible={false}
              badgeText="Popular"
              footerText=""
              showFooter={false}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}