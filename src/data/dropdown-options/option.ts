import { countryList } from "./countryList";
import { schoolList } from "./schoolList";

export enum DropdownTypes {
  age,
  school,
  country,
  fieldOfStudy,
  levelsOfStudy,
  shirtSize,
  gender,
  ethnicity,
  sexualIdentity,
}

const schoolOptions = schoolList;
export type DropdownConfig = {
  options: { value: string | number; label?: string }[];
  placeholder: string;
  label: string;
};

const countries = countryList.map((c) => ({ value: c.code, label: c.value }));

const ages = Array.from({ length: 10 }, (_, i) => ({ value: 16 + i }));

const levelsOfStudy = [
  { value: 0, label: "High School" },
  { value: 1, label: "Undergraduate" },
  { value: 2, label: "Graduate" },
  { value: 3, label: "Post Graduate" },
  { value: 4, label: "Other" },
];

const shirtSizes = [
  { value: "XS" },
  { value: "S" },
  { value: "M" },
  { value: "L" },
  { value: "XL" },
];

const genders = [
  { value: "", label: "Prefer not to say" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "NB", label: "Non-binary" },
];

const ethnicities = [
  { value: "", label: "Prefer not to say" },
  { value: "Asian" },
  { value: "Black or African" },
  { value: "Hispanic or Latino" },
  { value: "Middle Eastern or North African" },
  { value: "Indigenous / Aboriginal / Native" },
  { value: "Pacific Islander" },
  { value: "South Asian" },
  { value: "Southeast Asian" },
  { value: "East Asian" },
  { value: "White / Caucasian" },
  { value: "Mixed / Multiracial" },
];

const sexualIdentities = [
  { value: "", label: "Prefer not to say" },
  { value: "Asexual" },
  { value: "Bisexual" },
  { value: "Gay" },
  { value: "Lesbian" },
  { value: "Pansexual" },
  { value: "Queer" },
  { value: "Straight / Heterosexual" },
  { value: "Two-Spirit" },
];

export const dropdownOptions = new Map<DropdownTypes, DropdownConfig>([
  [
    DropdownTypes.age,
    {
      options: ages,
      placeholder: "Select your age",
      label: "Age",
    },
  ],
  [
    DropdownTypes.school,
    {
      options: schoolOptions,
      placeholder: "Select your school",
      label: "School",
    },
  ],
  [
    DropdownTypes.levelsOfStudy,
    {
      options: levelsOfStudy,
      placeholder: "Select your level of study",
      label: "Level of Study",
    },
  ],
  [
    DropdownTypes.country,
    {
      options: countries,
      placeholder: "Select your country",
      label: "Country",
    },
  ],
  [
    DropdownTypes.shirtSize,
    {
      options: shirtSizes,
      placeholder: "Select your shirt size",
      label: "Shirt Size",
    },
  ],
  [
    DropdownTypes.gender,
    {
      options: genders,
      placeholder: "Select your gender",
      label: "Gender",
    },
  ],
  [
    DropdownTypes.ethnicity,
    {
      options: ethnicities,
      placeholder: "Select your ethnicity",
      label: "Ethnicity",
    },
  ],
  [
    DropdownTypes.sexualIdentity,
    {
      options: sexualIdentities,
      placeholder: "Select your sexual identity",
      label: "Sexual Identity",
    },
  ],
]);
