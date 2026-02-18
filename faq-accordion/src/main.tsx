import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import FaqAccordion from "./components/FaqAccordion/FaqAccordion";
import "./components/FaqAccordion/FaqAccordion.css";

type ThemeType = "light" | "dark" | "brand" | "custom";

interface ThemeVars {
  "--background-primary": string;
  "--background-secondary": string;
  "--text-primary": string;
  "--text-secondary": string;
  "--border-color": string;
  "--accent-color": string;
  "--accent-text-color": string;
  "--border-radius": string;
}

const themes: Record<Exclude<ThemeType, "custom">, ThemeVars> = {
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
  const [activeTheme, setActiveTheme] = useState<ThemeType>("light");
  const [customVars, setCustomVars] = useState<ThemeVars>(themes.light);

  const currentVars = activeTheme === "custom" ? customVars : themes[activeTheme];

  const handleThemeChange = (theme: ThemeType) => {
    setActiveTheme(theme);
    if (theme !== "custom") {
      setCustomVars(themes[theme]);
    }
  };

  const handleCustomVarChange = (key: keyof ThemeVars, value: string) => {
    setCustomVars((prev) => ({ ...prev, [key]: value }));
  };

  const getPageBackground = () => {
    if (activeTheme === "dark") return "#000000";
    if (activeTheme === "brand") return "#fef3e8";
    return "#f9fafb";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: getPageBackground(),
        transition: "background-color 0.3s ease",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: getPageBackground(),
          borderBottom: `1px solid ${currentVars["--border-color"]}`,
          padding: "20px",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              margin: "0 0 16px 0",
              fontSize: "24px",
              fontWeight: "600",
              color: currentVars["--text-primary"],
            }}
          >
            FAQ Accordion Component Preview
          </h1>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <button
              onClick={() => handleThemeChange("light")}
              style={{
                padding: "10px 20px",
                border: `2px solid ${activeTheme === "light" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: "6px",
                backgroundColor: activeTheme === "light" ? currentVars["--accent-color"] : currentVars["--background-primary"],
                color: activeTheme === "light" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              style={{
                padding: "10px 20px",
                border: `2px solid ${activeTheme === "dark" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: "6px",
                backgroundColor: activeTheme === "dark" ? currentVars["--accent-color"] : currentVars["--background-primary"],
                color: activeTheme === "dark" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("brand")}
              style={{
                padding: "10px 20px",
                border: `2px solid ${activeTheme === "brand" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: "6px",
                backgroundColor: activeTheme === "brand" ? currentVars["--accent-color"] : currentVars["--background-primary"],
                color: activeTheme === "brand" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              Brand
            </button>
            <button
              onClick={() => handleThemeChange("custom")}
              style={{
                padding: "10px 20px",
                border: `2px solid ${activeTheme === "custom" ? currentVars["--accent-color"] : currentVars["--border-color"]}`,
                borderRadius: "6px",
                backgroundColor: activeTheme === "custom" ? currentVars["--accent-color"] : currentVars["--background-primary"],
                color: activeTheme === "custom" ? currentVars["--accent-text-color"] : currentVars["--text-primary"],
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              Custom
            </button>
          </div>

          {activeTheme === "custom" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                padding: "16px",
                backgroundColor: currentVars["--background-secondary"],
                borderRadius: "8px",
                border: `1px solid ${currentVars["--border-color"]}`,
              }}
            >
              {Object.entries(customVars).map(([key, value]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: currentVars["--text-secondary"],
                    }}
                  >
                    {key.replace(/--/g, "").replace(/-/g, " ")}
                  </label>
                  <input
                    type={key === "--border-radius" ? "text" : "color"}
                    value={value}
                    onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                    style={{
                      padding: key === "--border-radius" ? "6px" : "4px",
                      border: `1px solid ${currentVars["--border-color"]}`,
                      borderRadius: "4px",
                      backgroundColor: currentVars["--background-primary"],
                      cursor: "pointer",
                      height: key === "--border-radius" ? "auto" : "36px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "24px",
                color: currentVars["--text-primary"],
              }}
            >
              Default Configuration
            </h2>
            <FaqAccordion
              id="faq-default"
              heading="Frequently Asked Questions"
              subheading="Find answers to common questions about our service"
              iconPosition="right"
              defaultOpen={1}
              item1Question="What is your return policy?"
              item1Answer="We offer a 30-day money-back guarantee on all purchases. If you're not completely satisfied, contact our support team for a full refund."
              item1Visible={true}
              item2Question="How long does shipping take?"
              item2Answer="Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for delivery within 2-3 business days."
              item2Visible={true}
              item3Question="Do you offer customer support?"
              item3Answer="Yes! Our customer support team is available 24/7 via email, live chat, and phone. We're here to help with any questions or concerns."
              item3Visible={true}
              item4Question="Can I change my subscription plan?"
              item4Answer="Absolutely! You can upgrade or downgrade your subscription plan at any time from your account settings. Changes take effect immediately."
              item4Visible={true}
              item5Question="Is my data secure?"
              item5Answer="Security is our top priority. We use industry-standard encryption and comply with all major data protection regulations including GDPR and CCPA."
              item5Visible={true}
              item6Question="How do I cancel my account?"
              item6Answer="You can cancel your account at any time from your account settings. No questions asked, and you'll retain access until the end of your billing period."
              item6Visible={true}
            />
          </section>

          <section style={{ marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "24px",
                color: currentVars["--text-primary"],
              }}
            >
              Icon Position: Left
            </h2>
            <FaqAccordion
              id="faq-icon-left"
              heading="Product Information"
              subheading="Everything you need to know about our products"
              iconPosition="left"
              defaultOpen={2}
              item1Question="What materials are used?"
              item1Answer="Our products are crafted from premium, sustainably sourced materials including organic cotton, recycled polyester, and eco-friendly dyes."
              item1Visible={true}
              item2Question="Are your products eco-friendly?"
              item2Answer="Yes! We're committed to sustainability. All our products are made with environmentally conscious practices and materials."
              item2Visible={true}
              item3Question="Do you offer international shipping?"
              item3Answer="We ship to over 50 countries worldwide. International shipping rates and delivery times vary by location."
              item3Visible={true}
              item4Question="What sizes are available?"
              item4Answer="We offer a full range of sizes from XS to XXL. Check our size guide for detailed measurements."
              item4Visible={true}
              item5Visible={false}
              item6Visible={false}
            />
          </section>

          <section style={{ marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "24px",
                color: currentVars["--text-primary"],
              }}
            >
              Minimal Items (3 Items, No Default Open)
            </h2>
            <FaqAccordion
              id="faq-minimal"
              heading="Quick Questions"
              subheading="Brief answers to your most common queries"
              iconPosition="right"
              defaultOpen={0}
              item1Question="How do I get started?"
              item1Answer="Simply sign up for an account, choose your plan, and you'll be ready to go in minutes. Our onboarding guide will walk you through the setup process."
              item1Visible={true}
              item2Question="What payment methods do you accept?"
              item2Answer="We accept all major credit cards, PayPal, Apple Pay, and Google Pay for your convenience."
              item2Visible={true}
              item3Question="Can I try before I buy?"
              item3Answer="Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
              item3Visible={true}
              item4Visible={false}
              item5Visible={false}
              item6Visible={false}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);