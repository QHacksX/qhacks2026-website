import { DropdownConfig, dropdownOptions, DropdownTypes } from "@/data/dropdown-options/option";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export type OptionType = { value: string | number; label?: string };

export default function DropDownInput({
  title,
  type,
  value,
  onChange,
  options,
}: {
  title: string;
  type?: DropdownTypes;
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
  options?: OptionType[];
}) {
  const availableOptions = useMemo(() => {
    const config = type ? (dropdownOptions.get(type) as DropdownConfig | undefined) : undefined;
    return options || config?.options || [];
  }, [options, type]);

  const [filterText, setFilterText] = useState("");
  const [renderedCount, setRenderedCount] = useState(0);
  const batchSize = 100;

  const filteredOptions = useMemo(() => {
    return availableOptions.filter((opt: OptionType) => {
      const searchStr = opt.label || String(opt.value);
      return searchStr.toLowerCase().includes(filterText.toLowerCase());
    });
  }, [availableOptions, filterText]);

  useEffect(() => {
    setRenderedCount(Math.min(batchSize, filteredOptions.length));
  }, [filteredOptions]);

  const loadMore = () => {
    setRenderedCount((prev) => {
      const next = Math.min(prev + batchSize, filteredOptions.length);
      return next;
    });
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
      if (renderedCount < filteredOptions.length) {
        setTimeout(loadMore, 0);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "w-full rounded-md border border-[#E3C676] px-4 py-2 text-left",
          "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] focus:outline-none",
        )}
      >
        {value ? value.label || value.value : title}
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={4} align="start" className="w-64 border border-[#E3C676] bg-[#1A1A1A] text-white">
        <div className="border-b border-[#E3C676] p-2">
          <input
            autoFocus
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Type here to search..."
            className="w-full bg-transparent px-2 py-1 text-white placeholder-gray-400 focus:outline-none"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto" }} onScroll={onScroll}>
          {filteredOptions.slice(0, renderedCount).map((opt, idx) => (
            <DropdownMenuItem
              key={`${String(opt.value)}-${idx}`}
              className="cursor-pointer px-3 py-2 hover:bg-[#2A2A2A]"
              onSelect={() => onChange(opt)}
            >
              {opt.label || String(opt.value)}
            </DropdownMenuItem>
          ))}

          {renderedCount < filteredOptions.length && (
            <div className="py-2 text-center text-sm text-gray-400">Loading more...</div>
          )}

          {filteredOptions.length === 0 && <div className="px-3 py-2 text-sm text-gray-400">No results found</div>}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
