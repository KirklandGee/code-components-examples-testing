import { useState, useRef, useEffect } from "react";

export interface FaqAccordionProps {
  id?: string;
  heading?: React.ReactNode;
  subheading?: string;
  iconPosition?: "left" | "right";
  defaultOpen?: number;
  item1Question?: string;
  item1Answer?: React.ReactNode;
  item1Visible?: boolean;
  item2Question?: string;
  item2Answer?: React.ReactNode;
  item2Visible?: boolean;
  item3Question?: string;
  item3Answer?: React.ReactNode;
  item3Visible?: boolean;
  item4Question?: string;
  item4Answer?: React.ReactNode;
  item4Visible?: boolean;
  item5Question?: string;
  item5Answer?: React.ReactNode;
  item5Visible?: boolean;
  item6Question?: string;
  item6Answer?: React.ReactNode;
  item6Visible?: boolean;
}

interface AccordionItem {
  question: string;
  answer: React.ReactNode;
  visible: boolean;
}

export default function FaqAccordion({
  id,
  heading = "Frequently Asked Questions",
  subheading = "Find answers to common questions about our service",
  iconPosition = "right",
  defaultOpen = 1,
  item1Question = "What is your return policy?",
  item1Answer = "We offer a 30-day money-back guarantee on all purchases. If you're not completely satisfied, contact our support team for a full refund.",
  item1Visible = true,
  item2Question = "How long does shipping take?",
  item2Answer = "Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for delivery within 2-3 business days.",
  item2Visible = true,
  item3Question = "Do you offer customer support?",
  item3Answer = "Yes! Our customer support team is available 24/7 via email, live chat, and phone. We're here to help with any questions or concerns.",
  item3Visible = true,
  item4Question = "Can I change my subscription plan?",
  item4Answer = "Absolutely! You can upgrade or downgrade your subscription plan at any time from your account settings. Changes take effect immediately.",
  item4Visible = true,
  item5Question = "Is my data secure?",
  item5Answer = "Security is our top priority. We use industry-standard encryption and comply with all major data protection regulations including GDPR and CCPA.",
  item5Visible = true,
  item6Question = "How do I cancel my account?",
  item6Answer = "You can cancel your account at any time from your account settings. No questions asked, and you'll retain access until the end of your billing period.",
  item6Visible = true,
}: FaqAccordionProps) {
  const items: AccordionItem[] = [
    { question: item1Question, answer: item1Answer, visible: item1Visible },
    { question: item2Question, answer: item2Answer, visible: item2Visible },
    { question: item3Question, answer: item3Answer, visible: item3Visible },
    { question: item4Question, answer: item4Answer, visible: item4Visible },
    { question: item5Question, answer: item5Answer, visible: item5Visible },
    { question: item6Question, answer: item6Answer, visible: item6Visible },
  ];

  const visibleItems = items.filter((item) => item.visible);
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpen > 0 && defaultOpen <= visibleItems.length ? defaultOpen - 1 : null
  );
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, visibleItems.length);
  }, [visibleItems.length]);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleItem(index);
    }
  };

  return (
    <div id={id} className="wf-faqaccordion">
      <div className="wf-faqaccordion-header">
        <h2 className="wf-faqaccordion-heading">{heading}</h2>
        {subheading && <p className="wf-faqaccordion-subheading">{subheading}</p>}
      </div>
      <div className="wf-faqaccordion-list">
        {visibleItems.map((item, index) => {
          const isOpen = openIndex === index;
          const contentHeight = isOpen && contentRefs.current[index]
            ? contentRefs.current[index]!.scrollHeight
            : 0;

          return (
            <div
              key={index}
              className={`wf-faqaccordion-item ${isOpen ? "wf-faqaccordion-item-active" : ""}`}
            >
              <button
                className={`wf-faqaccordion-button wf-faqaccordion-button-${iconPosition}`}
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${index}`}
              >
                {iconPosition === "left" && (
                  <span
                    className={`wf-faqaccordion-icon ${isOpen ? "wf-faqaccordion-icon-open" : ""}`}
                    aria-hidden="true"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
                <span className="wf-faqaccordion-question">{item.question}</span>
                {iconPosition === "right" && (
                  <span
                    className={`wf-faqaccordion-icon ${isOpen ? "wf-faqaccordion-icon-open" : ""}`}
                    aria-hidden="true"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
              <div
                id={`faq-content-${index}`}
                className="wf-faqaccordion-content-wrapper"
                style={{
                  maxHeight: `${contentHeight}px`,
                }}
                aria-hidden={!isOpen}
              >
                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="wf-faqaccordion-content"
                >
                  <div className="wf-faqaccordion-answer">{item.answer}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}