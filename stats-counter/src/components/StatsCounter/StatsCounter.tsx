import { useState, useEffect, useRef } from "react";

export interface StatsCounterProps {
  id?: string;
  layout?: "row" | "grid";
  alignment?: "left" | "center" | "right";
  dividerStyle?: "none" | "line" | "dot";
  numberSize?: "medium" | "large" | "xlarge";
  heading?: React.ReactNode;
  subheading?: string;
  showHeading?: boolean;
  animationDuration?: number;
  animateOnScroll?: boolean;
  animateOnce?: boolean;
  stat1Value?: number;
  stat1Prefix?: string;
  stat1Suffix?: string;
  stat1Label?: string;
  stat1Description?: string;
  stat1Visible?: boolean;
  stat2Value?: number;
  stat2Prefix?: string;
  stat2Suffix?: string;
  stat2Label?: string;
  stat2Description?: string;
  stat2Visible?: boolean;
  stat3Value?: number;
  stat3Prefix?: string;
  stat3Suffix?: string;
  stat3Label?: string;
  stat3Description?: string;
  stat3Visible?: boolean;
  stat4Value?: number;
  stat4Prefix?: string;
  stat4Suffix?: string;
  stat4Label?: string;
  stat4Description?: string;
  stat4Visible?: boolean;
  stat5Value?: number;
  stat5Prefix?: string;
  stat5Suffix?: string;
  stat5Label?: string;
  stat5Description?: string;
  stat5Visible?: boolean;
  stat6Value?: number;
  stat6Prefix?: string;
  stat6Suffix?: string;
  stat6Label?: string;
  stat6Description?: string;
  stat6Visible?: boolean;
}

interface Stat {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
  visible: boolean;
}

export default function StatsCounter({
  id,
  layout = "row",
  alignment = "center",
  dividerStyle = "line",
  numberSize = "large",
  heading,
  subheading = "A snapshot of what we've built together",
  showHeading = true,
  animationDuration = 2000,
  animateOnScroll = true,
  animateOnce = true,
  stat1Value = 12000,
  stat1Prefix = "",
  stat1Suffix = "+",
  stat1Label = "Happy customers",
  stat1Description = "Across 40 countries",
  stat1Visible = true,
  stat2Value = 98,
  stat2Prefix = "",
  stat2Suffix = "%",
  stat2Label = "Customer satisfaction",
  stat2Description = "Based on annual NPS survey",
  stat2Visible = true,
  stat3Value = 250,
  stat3Prefix = "$",
  stat3Suffix = "M",
  stat3Label = "Funding raised",
  stat3Description = "Series C lead by Sequoia",
  stat3Visible = true,
  stat4Value = 150,
  stat4Prefix = "",
  stat4Suffix = "",
  stat4Label = "Team members",
  stat4Description = "Remote-first across 12 time zones",
  stat4Visible = true,
  stat5Value = 0,
  stat5Prefix = "",
  stat5Suffix = "",
  stat5Label = "Awards won",
  stat5Description = "",
  stat5Visible = false,
  stat6Value = 0,
  stat6Prefix = "",
  stat6Suffix = "",
  stat6Label = "",
  stat6Description = "",
  stat6Visible = false,
}: StatsCounterProps) {
  const stats: Stat[] = [
    { value: stat1Value, prefix: stat1Prefix, suffix: stat1Suffix, label: stat1Label, description: stat1Description, visible: stat1Visible },
    { value: stat2Value, prefix: stat2Prefix, suffix: stat2Suffix, label: stat2Label, description: stat2Description, visible: stat2Visible },
    { value: stat3Value, prefix: stat3Prefix, suffix: stat3Suffix, label: stat3Label, description: stat3Description, visible: stat3Visible },
    { value: stat4Value, prefix: stat4Prefix, suffix: stat4Suffix, label: stat4Label, description: stat4Description, visible: stat4Visible },
    { value: stat5Value, prefix: stat5Prefix, suffix: stat5Suffix, label: stat5Label, description: stat5Description, visible: stat5Visible },
    { value: stat6Value, prefix: stat6Prefix, suffix: stat6Suffix, label: stat6Label, description: stat6Description, visible: stat6Visible },
  ].filter(stat => stat.visible);

  const [displayValues, setDisplayValues] = useState<number[]>(stats.map(() => 0));
  const [shouldAnimate, setShouldAnimate] = useState(!animateOnScroll);
  const hasAnimatedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animateOnScroll) {
      setShouldAnimate(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animateOnce || !hasAnimatedRef.current) {
              setShouldAnimate(true);
              hasAnimatedRef.current = true;
            }
            if (animateOnce) {
              observer.disconnect();
            }
          } else if (!animateOnce) {
            setShouldAnimate(false);
            setDisplayValues(stats.map(() => 0));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animateOnScroll, animateOnce, stats.length]);

  useEffect(() => {
    if (!shouldAnimate) return;

    const startTime = Date.now();
    const startValues = displayValues.map(() => 0);

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeOutExpo(progress);

      const newValues = stats.map((stat, index) => {
        const start = startValues[index];
        const end = stat.value;
        return Math.round(start + (end - start) * easedProgress);
      });

      setDisplayValues(newValues);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [shouldAnimate, animationDuration]);

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  return (
    <div
      id={id}
      ref={containerRef}
      className={`wf-statscounter wf-statscounter--layout-${layout} wf-statscounter--align-${alignment} wf-statscounter--divider-${dividerStyle} wf-statscounter--size-${numberSize}`}
    >
      {showHeading && (heading || subheading) && (
        <div className="wf-statscounter-header">
          {heading && <h2 className="wf-statscounter-heading">{heading}</h2>}
          {subheading && <p className="wf-statscounter-subheading">{subheading}</p>}
        </div>
      )}
      <div className="wf-statscounter-grid">
        {stats.map((stat, index) => (
          <div key={index} className="wf-statscounter-item">
            <div className="wf-statscounter-number">
              {stat.prefix && <span className="wf-statscounter-prefix">{stat.prefix}</span>}
              <span className="wf-statscounter-value">{formatNumber(displayValues[index] || 0)}</span>
              {stat.suffix && <span className="wf-statscounter-suffix">{stat.suffix}</span>}
            </div>
            {stat.label && <div className="wf-statscounter-label">{stat.label}</div>}
            {stat.description && <div className="wf-statscounter-description">{stat.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}