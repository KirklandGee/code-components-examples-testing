import React from "react";

export interface PricingTableProps {
  id?: string;
  layout?: "horizontal" | "vertical";
  heading?: React.ReactNode;
  subheading?: string;
  tier1Name?: string;
  tier1Price?: string;
  tier1Period?: string;
  tier1Description?: string;
  tier1Features?: string;
  tier1CtaText?: string;
  tier1CtaLink?: string;
  tier1Visible?: boolean;
  tier2Name?: string;
  tier2Price?: string;
  tier2Period?: string;
  tier2Description?: string;
  tier2Features?: string;
  tier2CtaText?: string;
  tier2CtaLink?: string;
  tier2Recommended?: boolean;
  tier2Visible?: boolean;
  tier3Name?: string;
  tier3Price?: string;
  tier3Period?: string;
  tier3Description?: string;
  tier3Features?: string;
  tier3CtaText?: string;
  tier3CtaLink?: string;
  tier3Visible?: boolean;
  badgeText?: string;
  footerText?: string;
  showFooter?: boolean;
}

export default function PricingTable({
  id,
  layout = "horizontal",
  heading = "Choose Your Plan",
  subheading = "Select the perfect plan for your needs",
  tier1Name = "Basic",
  tier1Price = "$9",
  tier1Period = "/month",
  tier1Description = "Perfect for getting started",
  tier1Features = "Up to 5 projects\nBasic support\n1GB storage\nEmail notifications",
  tier1CtaText = "Get Started",
  tier1CtaLink = "#",
  tier1Visible = true,
  tier2Name = "Professional",
  tier2Price = "$29",
  tier2Period = "/month",
  tier2Description = "Most popular choice",
  tier2Features = "Unlimited projects\nPriority support\n10GB storage\nAdvanced analytics\nTeam collaboration\nCustom integrations",
  tier2CtaText = "Start Free Trial",
  tier2CtaLink = "#",
  tier2Recommended = true,
  tier2Visible = true,
  tier3Name = "Enterprise",
  tier3Price = "$99",
  tier3Period = "/month",
  tier3Description = "For large organizations",
  tier3Features = "Everything in Pro\nDedicated support\nUnlimited storage\nAdvanced security\nCustom workflows\nSLA guarantee",
  tier3CtaText = "Contact Sales",
  tier3CtaLink = "#",
  tier3Visible = true,
  badgeText = "Most Popular",
  footerText = "All plans include 24/7 support and 30-day money-back guarantee",
  showFooter = true,
}: PricingTableProps) {
  const tiers = [
    {
      name: tier1Name,
      price: tier1Price,
      period: tier1Period,
      description: tier1Description,
      features: tier1Features,
      ctaText: tier1CtaText,
      ctaLink: tier1CtaLink,
      visible: tier1Visible,
      recommended: false,
    },
    {
      name: tier2Name,
      price: tier2Price,
      period: tier2Period,
      description: tier2Description,
      features: tier2Features,
      ctaText: tier2CtaText,
      ctaLink: tier2CtaLink,
      visible: tier2Visible,
      recommended: tier2Recommended,
    },
    {
      name: tier3Name,
      price: tier3Price,
      period: tier3Period,
      description: tier3Description,
      features: tier3Features,
      ctaText: tier3CtaText,
      ctaLink: tier3CtaLink,
      visible: tier3Visible,
      recommended: false,
    },
  ];

  const visibleTiers = tiers.filter((tier) => tier.visible);

  return (
    <div
      id={id}
      className="wf-pricingtable"
      data-layout={layout}
    >
      <header className="wf-pricingtable-header">
        <h2 className="wf-pricingtable-heading">{heading}</h2>
        {subheading && (
          <p className="wf-pricingtable-subheading">{subheading}</p>
        )}
      </header>

      <div className="wf-pricingtable-cards">
        {visibleTiers.map((tier, index) => (
          <article
            key={index}
            className={`wf-pricingtable-card ${
              tier.recommended ? "wf-pricingtable-card-recommended" : ""
            }`}
          >
            {tier.recommended && (
              <div className="wf-pricingtable-badge">{badgeText}</div>
            )}

            <div className="wf-pricingtable-card-header">
              <h3 className="wf-pricingtable-tier-name">{tier.name}</h3>
              <div className="wf-pricingtable-pricing">
                <span className="wf-pricingtable-price">{tier.price}</span>
                <span className="wf-pricingtable-period">{tier.period}</span>
              </div>
              <p className="wf-pricingtable-description">{tier.description}</p>
            </div>

            <ul className="wf-pricingtable-features">
              {tier.features.split(/\\n|\n/).map((feature, featureIndex) => (
                <li key={featureIndex} className="wf-pricingtable-feature">
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={tier.ctaLink}
              className="wf-pricingtable-cta"
            >
              {tier.ctaText}
            </a>
          </article>
        ))}
      </div>

      {showFooter && footerText && (
        <footer className="wf-pricingtable-footer">
          <p className="wf-pricingtable-footer-text">{footerText}</p>
        </footer>
      )}
    </div>
  );
}