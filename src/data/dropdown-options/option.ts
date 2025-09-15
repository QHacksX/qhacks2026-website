import { countryList } from "./countryList";
import { schoolList } from "./schoolList";
export enum DropdownTypes {
    age,
    school,
    country,
    fieldOfStudy,
    levelsOfStudy
}

const schoolOptions = schoolList 
export type DropdownConfig={
    options: any[];
    placeholder: string;
    label: string;
}

const countries = countryList

const ages = [
  { value: 16 },
  { value: 17 },
  { value: 18 },
  { value: 19 },
  { value: 20 },
  { value: 21 },
  { value: 22 },
  { value: 23 },
  { value: 24 },
  { value: 25 },
];

const levelsOfStudy = [
  { value: "Less than Secondary / High School" },
  { value: "Secondary / High School" },
  {
    value: "Undergraduate University (2 year - community college or similar)",
  },
  { value: "Undergraduate University (3+ year)" },
  { value: "Graduate University (Masters, Professional, Doctoral, etc)" },
  { value: "Code School / Bootcamp" },
  { value: "Other Vocational / Trade Program or Apprenticeship" },
  { value: "Post Doctorate" },
  { value: "Other" },
  { value: "I'm not currently a student" },
  { value: "Prefer not to answer" },
];

export const dropdownOptions = new Map<DropdownTypes, DropdownConfig>([
    [DropdownTypes.age, {
        options: ages,
        placeholder: "Select your age",
        label: "Age"
    }],
    [DropdownTypes.school, {
        options: schoolOptions,
        placeholder: "Select your school",
        label: "School"
    }],
    [DropdownTypes.levelsOfStudy, {
        options: levelsOfStudy,
        placeholder: "Select your level of study",
        label: "Level of Study"
    }],
    [DropdownTypes.country, {
        options: countries,
        placeholder: "Select your country",
        label: "Country"
    }]
])
 
