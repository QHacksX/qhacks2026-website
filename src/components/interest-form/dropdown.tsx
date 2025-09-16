import { dropdownOptions, DropdownTypes } from "@/data/dropdown-options/option";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction } from "react";

export default function DropDownInput({
  title,
  type,
  value,
  setValue,
}: {
  title: string;
  type: DropdownTypes;
  value: any;
  setValue: Dispatch<SetStateAction<any>>;
}) {
  const dropdownConfig = dropdownOptions.get(type);
  const itemTemplate = (item: any) => {
    return (
      <div className="bg-white p-4 text-black hover:bg-gray-300">
        {item.value}
      </div>
    );
  };
  const filterTemplate = (opts: any) => {
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
  const getText = (opt: any) => opt?.value ?? "";
  const valueTemplate = (opt: any, props: { placeholder?: string }) => {
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
