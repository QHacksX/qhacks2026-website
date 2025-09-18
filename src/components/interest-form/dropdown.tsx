import {
  DropdownConfig,
  dropdownOptions,
  DropdownTypes,
} from "@/data/dropdown-options/option";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useMemo, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type OptionType = { value: string | number };

export default function DropDownInput({
  title,
  type,
  value,
  setValue,
}: {
  title: string;
  type: DropdownTypes;
  value: OptionType | null;
  setValue: Dispatch<SetStateAction<OptionType | null>>;
}) {
  const dropdownConfig = dropdownOptions.get(type) as
    | DropdownConfig
    | undefined;

  const [filterText, setFilterText] = useState("");
  const [renderedCount, setRenderedCount] = useState(0);
  const batchSize = 100;

  const filteredOptions = useMemo(() => {
    return (
      dropdownConfig?.options?.filter((opt: OptionType) =>
        String(opt.value).toLowerCase().includes(filterText.toLowerCase()),
      ) ?? []
    );
  }, [dropdownConfig?.options, filterText]);

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
          "w-full px-4 py-2 rounded-md border border-[#E3C676] text-left",
          "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] focus:outline-none",
        )}
      >
        {value ? value.value : (dropdownConfig?.placeholder ?? title)}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={4}
        align="start"
        className="w-64 bg-[#1A1A1A] text-white border border-[#E3C676]"
      >
        <div className="p-2 border-b border-[#E3C676]">
          <input
            autoFocus
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Type here to search..."
            className="w-full bg-transparent text-white placeholder-gray-400 px-2 py-1 focus:outline-none"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div
          style={{ maxHeight: "300px", overflowY: "auto" }}
          onScroll={onScroll}
        >
          {filteredOptions.slice(0, renderedCount).map((opt, idx) => (
            <DropdownMenuItem
              key={`${String(opt.value)}-${idx}`}
              className="px-3 py-2 cursor-pointer hover:bg-[#2A2A2A]"
              onSelect={() => setValue(opt)}
            >
              {String(opt.value)}
            </DropdownMenuItem>
          ))}

          {renderedCount < filteredOptions.length && (
            <div className="py-2 text-center text-sm text-gray-400">
              Loading more...
            </div>
          )}

          {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
