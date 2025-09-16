import {
  DropdownConfig,
  dropdownOptions,
  DropdownTypes,
} from "@/data/dropdown-options/option";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction } from "react";

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

  const itemTemplate = (item: OptionType) => {
    return (
      <div className="bg-white p-4 text-black hover:bg-gray-300">
        {item.value}
      </div>
    );
  };

  const filterTemplate = (opts: {
    filterInputProps: React.ComponentProps<typeof InputText>;
  }) => {
    // opts.filterInputProps carries the right handlers for filtering
    return (
      <div className="p-3 border-b border-[#E3C676] bg-[#1a1a1a]">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search text-[#E3C676]" />
          <InputText
            {...opts.filterInputProps}
            className="w-full bg-transparent text-white placeholder-gray-400 border-b border-[#E3C676] focus:border-yellow-400 focus:ring-0"
            placeholder="Search your school…"
            autoFocus
          />
        </span>
      </div>
    );
  };

  const getText = (opt: OptionType | null) => opt?.value ?? "";
  const valueTemplate = (
    opt: OptionType | null,
    props: { placeholder?: string },
  ) => {
    if (!opt)
      return (
        <span className="opacity-100 text-white">{props.placeholder}</span>
      );
    return <span className="opacity-100 text-white">{getText(opt)}</span>;
  };

  return (
    <div>
      <Dropdown
        value={value}
        onChange={(e: DropdownChangeEvent) => setValue(e.value)}
        options={dropdownConfig?.options}
        optionLabel="value"
        placeholder={dropdownConfig?.placeholder}
        // filter
        itemTemplate={itemTemplate}
        valueTemplate={valueTemplate}
        virtualScrollerOptions={{ itemSize: 38 }}
        filter
        filterDelay={400}
        className="w-full md:w-14rem input-base bg-white text-black"
        panelClassName="bg-white border border-b border-[#C8B476] focus:border-[#E3C676]  text-black shadow-lg px-4 py-4 p-4"
      />
    </div>
  );
}
