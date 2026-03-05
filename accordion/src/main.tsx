import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import Accordion from "./components/Accordion/Accordion"
import "./components/Accordion/Accordion.css"

type ThemeVars = {
  "--background-primary": string
  "--background-secondary": string
  "--text-primary": string
  "--text-secondary": string
  "--border-color": string
  "--accent-color": string
  "--accent-text-color": string
  "--border-radius": string
}

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
}

function App() {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "brand" | "custom">("light")
  const [customVars, setCustomVars] = useState<ThemeVars>(themes.light)

  const currentVars = activeTheme === "custom" ? customVars : themes[activeTheme]

  const handleThemeChange = (theme: "light" | "dark" | "brand" | "custom") => {
    setActiveTheme(theme)
    if (theme !== "custom") {
      setCustomVars(themes[theme])
    }
  }

  const handleCustomVarChange = (key: keyof ThemeVars, value: string) => {
    setCustomVars((prev) => ({ ...prev, [key]: value }))
  }

  const pageBackgroundColor = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef3e8" : "#f9fafb"

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: pageBackgroundColor,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      transition: "background-color 0.3s ease"
    }}>
      <div style={{ 
        position: "sticky",
        top: 0,
        backgroundColor: activeTheme === "dark" ? "#0a0a0a" : "#ffffff",
        borderBottom: `1px solid ${activeTheme === "dark" ? "#2a2a2a" : "#e5e5e5"}`,
        padding: "20px",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ 
            margin: "0 0 20px 0", 
            fontSize: "24px", 
            fontWeight: "600",
            color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
          }}>
            Accordion Component Preview
          </h1>
          
          <div style={{ marginBottom: "20px" }}>
            <div style={{ 
              display: "flex", 
              gap: "8px", 
              flexWrap: "wrap",
              marginBottom: "16px"
            }}>
              <button
                onClick={() => handleThemeChange("light")}
                style={{
                  padding: "10px 20px",
                  border: activeTheme === "light" ? "2px solid #2563eb" : "1px solid #e5e5e5",
                  borderRadius: "6px",
                  backgroundColor: activeTheme === "light" ? "#eff6ff" : "#ffffff",
                  color: activeTheme === "light" ? "#2563eb" : "#1a1a1a",
                  fontWeight: activeTheme === "light" ? "600" : "500",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease"
                }}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                style={{
                  padding: "10px 20px",
                  border: activeTheme === "dark" ? "2px solid #3b82f6" : "1px solid #2a2a2a",
                  borderRadius: "6px",
                  backgroundColor: activeTheme === "dark" ? "#1e3a8a" : "#1a1a1a",
                  color: "#ffffff",
                  fontWeight: activeTheme === "dark" ? "600" : "500",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease"
                }}
              >
                Dark
              </button>
              <button
                onClick={() => handleThemeChange("brand")}
                style={{
                  padding: "10px 20px",
                  border: activeTheme === "brand" ? "2px solid #ea580c" : "1px solid #e7e5e4",
                  borderRadius: "6px",
                  backgroundColor: activeTheme === "brand" ? "#ffedd5" : "#fef7f0",
                  color: activeTheme === "brand" ? "#ea580c" : "#1c1917",
                  fontWeight: activeTheme === "brand" ? "600" : "500",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease"
                }}
              >
                Brand
              </button>
              <button
                onClick={() => handleThemeChange("custom")}
                style={{
                  padding: "10px 20px",
                  border: activeTheme === "custom" ? "2px solid #8b5cf6" : "1px solid #e5e5e5",
                  borderRadius: "6px",
                  backgroundColor: activeTheme === "custom" ? "#f5f3ff" : "#ffffff",
                  color: activeTheme === "custom" ? "#8b5cf6" : "#1a1a1a",
                  fontWeight: activeTheme === "custom" ? "600" : "500",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease"
                }}
              >
                Custom
              </button>
            </div>

            {activeTheme === "custom" && (
              <div style={{
                backgroundColor: activeTheme === "dark" ? "#1a1a1a" : "#f9fafb",
                border: `1px solid ${activeTheme === "dark" ? "#2a2a2a" : "#e5e5e5"}`,
                borderRadius: "8px",
                padding: "20px",
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
                  gap: "16px" 
                }}>
                  {Object.entries(customVars).map(([key, value]) => (
                    <div key={key}>
                      <label style={{ 
                        display: "block", 
                        marginBottom: "6px", 
                        fontSize: "13px", 
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
                          padding: key === "--border-radius" ? "8px" : "4px",
                          border: `1px solid ${activeTheme === "dark" ? "#2a2a2a" : "#e5e5e5"}`,
                          borderRadius: "4px",
                          fontSize: "14px",
                          backgroundColor: activeTheme === "dark" ? "#0a0a0a" : "#ffffff",
                          color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a",
                          cursor: "pointer"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={currentVars as React.CSSProperties}>
            <section style={{ marginBottom: "60px" }}>
              <h2 style={{ 
                margin: "0 0 24px 0", 
                fontSize: "20px", 
                fontWeight: "600",
                color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
              }}>
                Default Configuration
              </h2>
              <Accordion
                id="accordion-default"
                variant="bordered"
                expansionMode="single"
                item1Visible={true}
                item1Title="What is your return policy?"
                item1Content="We offer a 30-day money-back guarantee on all purchases. If you're not completely satisfied with your order, you can return it for a full refund within 30 days of delivery."
                item2Visible={true}
                item2Title="How long does shipping take?"
                item2Content="Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for delivery within 2-3 business days."
                item3Visible={true}
                item3Title="Do you offer international shipping?"
                item3Content="Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination and will be calculated at checkout."
                item4Visible={true}
                item4Title="How can I track my order?"
                item4Content="Once your order ships, you'll receive a tracking number via email. You can use this number to monitor your shipment's progress on our website or the carrier's tracking page."
                item5Visible={true}
                item5Title="What payment methods do you accept?"
                item5Content="We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay for your convenience."
              />
            </section>

            <section style={{ marginBottom: "60px" }}>
              <h2 style={{ 
                margin: "0 0 24px 0", 
                fontSize: "20px", 
                fontWeight: "600",
                color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
              }}>
                Flush Variant with Multiple Expansion
              </h2>
              <Accordion
                id="accordion-flush-multiple"
                variant="flush"
                expansionMode="multiple"
                item1Visible={true}
                item1Title="Can I change my order after placing it?"
                item1Content="Yes, you can modify your order within 2 hours of placing it by contacting our customer service team. After this window, we cannot guarantee changes as your order may have already been processed."
                item2Visible={true}
                item2Title="Do you offer gift wrapping?"
                item2Content="Absolutely! We offer complimentary gift wrapping on all orders. Simply select the gift wrap option at checkout and include a personalized message if desired."
                item3Visible={true}
                item3Title="What if I receive a damaged item?"
                item3Content="We're sorry if your item arrived damaged. Please contact us within 48 hours with photos of the damage, and we'll arrange for a replacement or full refund immediately."
                item4Visible={false}
                item5Visible={false}
              />
            </section>

            <section style={{ marginBottom: "60px" }}>
              <h2 style={{ 
                margin: "0 0 24px 0", 
                fontSize: "20px", 
                fontWeight: "600",
                color: activeTheme === "dark" ? "#fafafa" : "#1a1a1a"
              }}>
                Minimal FAQ (3 Items)
              </h2>
              <Accordion
                id="accordion-minimal"
                variant="bordered"
                expansionMode="single"
                item1Visible={true}
                item1Title="How do I create an account?"
                item1Content="Click the 'Sign Up' button in the top right corner of our website. Fill in your email address and create a secure password. You'll receive a confirmation email to verify your account."
                item2Visible={true}
                item2Title="Can I save items for later?"
                item2Content="Yes! Simply click the heart icon on any product to add it to your wishlist. You can access your saved items anytime by clicking the wishlist icon in the navigation bar."
                item3Visible={true}
                item3Title="Do you have a loyalty program?"
                item3Content="Yes, our rewards program gives you points for every purchase. Earn 1 point per dollar spent, and redeem points for discounts on future orders. Join free when you create an account!"
                item4Visible={false}
                item5Visible={false}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)