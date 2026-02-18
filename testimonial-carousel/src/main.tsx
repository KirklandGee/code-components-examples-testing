import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import TestimonialCarousel from "./components/TestimonialCarousel/TestimonialCarousel";
import "./components/TestimonialCarousel/TestimonialCarousel.css";

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

  const pageBackground = activeTheme === "dark" ? "#000000" : activeTheme === "brand" ? "#fef3e8" : "#f9fafb";

  return (
    <div style={{ minHeight: "100vh", background: pageBackground, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "40px", background: currentVars["--background-primary"], padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "700", color: currentVars["--text-primary"] }}>
            Testimonial Carousel Preview
          </h1>
          <p style={{ margin: "0 0 24px 0", fontSize: "15px", color: currentVars["--text-secondary"] }}>
            Test different theme configurations and prop variations
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: activeTheme === "custom" ? "24px" : "0" }}>
            <button
              onClick={() => handleThemeChange("light")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "light" ? "2px solid #2563eb" : "2px solid #e5e5e5",
                borderRadius: "8px",
                background: activeTheme === "light" ? "#eff6ff" : "#ffffff",
                color: activeTheme === "light" ? "#2563eb" : "#1a1a1a",
                fontWeight: activeTheme === "light" ? "600" : "500",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "dark" ? "2px solid #3b82f6" : "2px solid #2a2a2a",
                borderRadius: "8px",
                background: activeTheme === "dark" ? "#1e293b" : "#0a0a0a",
                color: activeTheme === "dark" ? "#3b82f6" : "#fafafa",
                fontWeight: activeTheme === "dark" ? "600" : "500",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("brand")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "brand" ? "2px solid #ea580c" : "2px solid #e7e5e4",
                borderRadius: "8px",
                background: activeTheme === "brand" ? "#ffedd5" : "#fef7f0",
                color: activeTheme === "brand" ? "#ea580c" : "#1c1917",
                fontWeight: activeTheme === "brand" ? "600" : "500",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              Brand
            </button>
            <button
              onClick={() => handleThemeChange("custom")}
              style={{
                padding: "10px 20px",
                border: activeTheme === "custom" ? "2px solid #8b5cf6" : "2px solid #e5e5e5",
                borderRadius: "8px",
                background: activeTheme === "custom" ? "#f5f3ff" : "#ffffff",
                color: activeTheme === "custom" ? "#8b5cf6" : "#1a1a1a",
                fontWeight: activeTheme === "custom" ? "600" : "500",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              Custom
            </button>
          </div>

          {activeTheme === "custom" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "24px", padding: "20px", background: currentVars["--background-secondary"], borderRadius: "8px" }}>
              {Object.entries(customVars).map(([key, value]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: currentVars["--text-primary"], textTransform: "capitalize" }}>
                    {key.replace(/--/g, "").replace(/-/g, " ")}
                  </label>
                  <input
                    type={key === "--border-radius" ? "text" : "color"}
                    value={value}
                    onChange={(e) => handleCustomVarChange(key as keyof ThemeVars, e.target.value)}
                    style={{
                      padding: key === "--border-radius" ? "8px" : "4px",
                      border: `1px solid ${currentVars["--border-color"]}`,
                      borderRadius: "6px",
                      fontSize: "13px",
                      height: key === "--border-radius" ? "auto" : "40px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </header>

        <div style={currentVars as React.CSSProperties}>
          <section style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: currentVars["--text-primary"] }}>
              Default Configuration
            </h2>
            <TestimonialCarousel
              heading="What Our Customers Say"
              subheading="Trusted by thousands of satisfied customers worldwide"
              showNavigation={true}
              showPagination={true}
              enableAutoplay={true}
              autoplayDelay={5000}
              testimonial1Text="This product has completely transformed how we work. The team is responsive and the features are exactly what we needed."
              testimonial1AuthorName="Sarah Johnson"
              testimonial1AuthorRole="Marketing Director"
              testimonial1AuthorCompany="TechCorp Inc."
              testimonial1Avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
              testimonial1Visible={true}
              testimonial2Text="Outstanding service and support. We've seen a 300% increase in productivity since implementing this solution."
              testimonial2AuthorName="Michael Chen"
              testimonial2AuthorRole="CEO"
              testimonial2AuthorCompany="Growth Solutions"
              testimonial2Avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              testimonial2Visible={true}
              testimonial3Text="The best investment we've made this year. Intuitive, powerful, and reliable. Highly recommended!"
              testimonial3AuthorName="Emily Rodriguez"
              testimonial3AuthorRole="Product Manager"
              testimonial3AuthorCompany="Innovate Labs"
              testimonial3Avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
              testimonial3Visible={true}
              testimonial4Text="Exceptional quality and attention to detail. Our clients have noticed the difference immediately."
              testimonial4AuthorName="David Thompson"
              testimonial4AuthorRole="Operations Lead"
              testimonial4AuthorCompany="Premier Services"
              testimonial4Avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
              testimonial4Visible={true}
              testimonial5Text="A game-changer for our business. Simple to use yet incredibly powerful. Worth every penny."
              testimonial5AuthorName="Jessica Williams"
              testimonial5AuthorRole="Founder"
              testimonial5AuthorCompany="Startup Studio"
              testimonial5Avatar="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop"
              testimonial5Visible={true}
            />
          </section>

          <section style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: currentVars["--text-primary"] }}>
              Minimal Configuration (3 Testimonials, No Autoplay)
            </h2>
            <TestimonialCarousel
              heading="Client Success Stories"
              subheading="Real results from real businesses"
              showNavigation={true}
              showPagination={true}
              enableAutoplay={false}
              autoplayDelay={5000}
              testimonial1Text="Working with this team has been an absolute pleasure. They delivered beyond our expectations and on time."
              testimonial1AuthorName="Alex Martinez"
              testimonial1AuthorRole="CTO"
              testimonial1AuthorCompany="Digital Ventures"
              testimonial1Avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
              testimonial1Visible={true}
              testimonial2Text="The ROI we've seen is incredible. This solution paid for itself within the first month."
              testimonial2AuthorName="Rachel Green"
              testimonial2AuthorRole="Finance Director"
              testimonial2AuthorCompany="Capital Group"
              testimonial2Avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
              testimonial2Visible={true}
              testimonial3Text="Customer support is top-notch. They're always available and genuinely care about our success."
              testimonial3AuthorName="James Wilson"
              testimonial3AuthorRole="VP Operations"
              testimonial3AuthorCompany="Enterprise Solutions"
              testimonial3Avatar="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
              testimonial3Visible={true}
              testimonial4Visible={false}
              testimonial5Visible={false}
            />
          </section>

          <section style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: currentVars["--text-primary"] }}>
              Fast Autoplay (2 Second Delay, No Navigation)
            </h2>
            <TestimonialCarousel
              heading="Loved by Thousands"
              subheading="Join our community of satisfied customers"
              showNavigation={false}
              showPagination={true}
              enableAutoplay={true}
              autoplayDelay={2000}
              testimonial1Text="Fast, reliable, and exactly what we needed. Couldn't be happier with our choice!"
              testimonial1AuthorName="Sophie Anderson"
              testimonial1AuthorRole="Marketing Lead"
              testimonial1AuthorCompany="Creative Agency"
              testimonial1Visible={true}
              testimonial2Text="The interface is so intuitive. Our entire team was up and running in minutes."
              testimonial2AuthorName="Marcus Brown"
              testimonial2AuthorRole="Team Lead"
              testimonial2AuthorCompany="Tech Startup"
              testimonial2Visible={true}
              testimonial3Text="Best decision we made this quarter. Highly recommend to anyone looking for quality."
              testimonial3AuthorName="Lisa Chang"
              testimonial3AuthorRole="Director"
              testimonial3AuthorCompany="Innovation Hub"
              testimonial3Visible={true}
              testimonial4Text="Seamless integration with our existing tools. The transition was smooth and painless."
              testimonial4AuthorName="Robert Taylor"
              testimonial4AuthorRole="IT Manager"
              testimonial4AuthorCompany="Global Corp"
              testimonial4Visible={true}
              testimonial5Visible={false}
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