import {
  DropdownConfig,
  dropdownOptions,
  DropdownTypes,
} from "@/data/dropdown-options/option";
import { Dispatch, SetStateAction, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

  const filteredOptions =
    dropdownConfig?.options?.filter((opt: OptionType) =>
      String(opt.value).toLowerCase().includes(filterText.toLowerCase()),
    ) ?? [];

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

      <DropdownMenuContent className="w-64 bg-[#1A1A1A] text-white border border-[#E3C676]">
        <div className="p-2 border-b border-[#E3C676]">
          <input
            autoFocus
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Type here to search..."
            className="w-full bg-transparent text-white placeholder-gray-400 px-2 py-1 focus:outline-none"
          />
        </div>

        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt, idx) => (
            <DropdownMenuItem
              key={`${String(opt.value)}-${idx}`}
              className="px-3 py-2 cursor-pointer hover:bg-[#2A2A2A]"
              onSelect={() => setValue(opt)}
            >
              {String(opt.value)}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text=gray-400">
            No results found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
