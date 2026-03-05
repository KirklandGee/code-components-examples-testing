import { useState, useRef, useEffect } from "react";

export interface AccordionProps {
  id?: string;
  variant?: "bordered" | "flush";
  expansionMode?: "single" | "multiple";
  item1Visible?: boolean;
  item1Title?: string;
  item1Content?: string;
  item2Visible?: boolean;
  item2Title?: string;
  item2Content?: string;
  item3Visible?: boolean;
  item3Title?: string;
  item3Content?: string;
  item4Visible?: boolean;
  item4Title?: string;
  item4Content?: string;
  item5Visible?: boolean;
  item5Title?: string;
  item5Content?: string;
}

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  visible: boolean;
}

export default function Accordion({
  id,
  variant = "bordered",
  expansionMode = "single",
  item1Visible = true,
  item1Title = "What is your return policy?",
  item1Content = "We offer a 30-day money-back guarantee on all purchases. If you're not completely satisfied with your order, you can return it for a full refund within 30 days of delivery.",
  item2Visible = true,
  item2Title = "How long does shipping take?",
  item2Content = "Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for delivery within 2-3 business days.",
  item3Visible = true,
  item3Title = "Do you offer international shipping?",
  item3Content = "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination and will be calculated at checkout.",
  item4Visible = true,
  item4Title = "How can I track my order?",
  item4Content = "Once your order ships, you'll receive a tracking number via email. You can use this number to monitor your shipment's progress on our website or the carrier's tracking page.",
  item5Visible = true,
  item5Title = "What payment methods do you accept?",
  item5Content = "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay for your convenience.",
}: AccordionProps) {
  const items: AccordionItem[] = [
    { id: "item-1", title: item1Title, content: item1Content, visible: item1Visible },
    { id: "item-2", title: item2Title, content: item2Content, visible: item2Visible },
    { id: "item-3", title: item3Title, content: item3Content, visible: item3Visible },
    { id: "item-4", title: item4Title, content: item4Content, visible: item4Visible },
    { id: "item-5", title: item5Title, content: item5Content, visible: item5Visible },
  ].filter((item) => item.visible);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(items.length > 0 ? [items[0].id] : [])
  );
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (expansionMode === "single") {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleItem(itemId);
    }
  };

  useEffect(() => {
    contentRefs.current.forEach((element, itemId) => {
      if (element) {
        if (expandedItems.has(itemId)) {
          element.style.maxHeight = `${element.scrollHeight}px`;
        } else {
          element.style.maxHeight = "0px";
        }
      }
    });
  }, [expandedItems]);

  return (
    <div id={id} className={`wf-accordion wf-accordion-${variant}`}>
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        const buttonId = `wf-accordion-button-${item.id}`;
        const panelId = `wf-accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="wf-accordion-item">
            <h3 className="wf-accordion-header">
              <button
                id={buttonId}
                type="button"
                className="wf-accordion-button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
              >
                <span className="wf-accordion-title">{item.title}</span>
                <svg
                  className={`wf-accordion-icon ${isExpanded ? "wf-accordion-icon-expanded" : ""}`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              ref={(el) => {
                if (el) {
                  contentRefs.current.set(item.id, el);
                } else {
                  contentRefs.current.delete(item.id);
                }
              }}
              className="wf-accordion-content"
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isExpanded}
            >
              <div
                className="wf-accordion-body"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}