import { useState } from "react";
import {
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";

export interface CalendarProps {
  id?: string;
  captionLayout?: "label" | "dropdown";
  showOutsideDays?: boolean;
  showWeekNumbers?: boolean;
  fixedWeeks?: boolean;
  size?: "compact" | "default" | "large";
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeMap = {
  compact: "28px",
  default: "36px",
  large: "44px",
};

export default function Calendar({
  id,
  captionLayout = "label",
  showOutsideDays = true,
  showWeekNumbers = false,
  fixedWeeks = false,
  size = "default",
  header,
  footer,
}: CalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const defaultClassNames = getDefaultClassNames();
  const cellSize = sizeMap[size];

  return (
    <div
      id={id}
      className="wf-calendar"
      style={{ "--wf-calendar-cell-size": cellSize } as React.CSSProperties}
    >
      {header && <div className="wf-calendar-header">{header}</div>}
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        showOutsideDays={showOutsideDays}
        showWeekNumber={showWeekNumbers}
        fixedWeeks={fixedWeeks}
        captionLayout={captionLayout}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString("default", { month: "short" }),
        }}
        classNames={{
          root: `wf-calendar-root ${defaultClassNames.root}`,
          months: `wf-calendar-months ${defaultClassNames.months}`,
          month: `wf-calendar-month ${defaultClassNames.month}`,
          nav: `wf-calendar-nav ${defaultClassNames.nav}`,
          button_previous: `wf-calendar-nav-btn ${defaultClassNames.button_previous}`,
          button_next: `wf-calendar-nav-btn ${defaultClassNames.button_next}`,
          month_caption: `wf-calendar-caption ${defaultClassNames.month_caption}`,
          dropdowns: `wf-calendar-dropdowns ${defaultClassNames.dropdowns}`,
          dropdown_root: `wf-calendar-dropdown-root ${defaultClassNames.dropdown_root}`,
          dropdown: `wf-calendar-dropdown ${defaultClassNames.dropdown}`,
          caption_label: `wf-calendar-caption-label ${defaultClassNames.caption_label}`,
          weekdays: `wf-calendar-weekdays ${defaultClassNames.weekdays}`,
          weekday: `wf-calendar-weekday ${defaultClassNames.weekday}`,
          week: `wf-calendar-week ${defaultClassNames.week}`,
          week_number_header: `wf-calendar-week-number-header ${defaultClassNames.week_number_header}`,
          week_number: `wf-calendar-week-number ${defaultClassNames.week_number}`,
          day: `wf-calendar-day ${defaultClassNames.day}`,
          day_button: `wf-calendar-day-btn ${defaultClassNames.day_button}`,
          selected: `wf-calendar-selected ${defaultClassNames.selected}`,
          today: `wf-calendar-today ${defaultClassNames.today}`,
          outside: `wf-calendar-outside ${defaultClassNames.outside}`,
          disabled: `wf-calendar-disabled ${defaultClassNames.disabled}`,
          hidden: `wf-calendar-hidden ${defaultClassNames.hidden}`,
          range_start: `wf-calendar-range-start ${defaultClassNames.range_start}`,
          range_middle: `wf-calendar-range-middle ${defaultClassNames.range_middle}`,
          range_end: `wf-calendar-range-end ${defaultClassNames.range_end}`,
        }}
      />
      {footer && <div className="wf-calendar-footer">{footer}</div>}
    </div>
  );
}
