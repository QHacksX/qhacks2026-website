'use client';

import DropDownInput from "@/components/interest-form/dropdown";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { DropdownTypes } from "@/data/dropdown-options/option";
import Link from "next/link";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";

const Page = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState(null);
  const [levelOfStudy, setLevelOfStudy] = useState(null);
  const [country, setCountry] = useState(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, age, phone }); // Replace with API/DB call
  };

  return (
    <div className="relative min-h-screen">
      {/* Close button */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-white hover:text-[#E3C676] transition-colors"
      >
        <IoIosClose size={40} className="sm:w-12 sm:h-12" />
      </Link>

      <div className="w-full min-h-screen bg-gradient-to-b from-[#020202] to-[#2B2929] px-4 sm:px-6 lg:px-8">
        <AnimatedStars />

        <div className="relative flex flex-col items-center font-semibold text-center max-w-3xl mx-auto text-2xl py-12">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#E3C676] text-center mb-8 sm:mb-12 py-6">
            QHacks 2026 Interest Form
          </h1>

          <p className="mt-4 max-w-2xl text-center text-gray-300">
            QHacks is your chance to learn, create, and connect with an awesome community. 
            Let us know you're interested—we'll make sure you're the first to hear when applications open!
          </p>
        </div>

        {/* Form below header div */}
        <div className="relative flex justify-center mt-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl  p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="input-base"
                  placeholder="First Name"

                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="input-base"
                  placeholder="Last Name"

                />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  Age *
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="input-base"
                  placeholder="Age"

                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="input-base"
                  placeholder="(000) 000-0000"
                  inputMode="tel"
                  pattern="\(\d{3}\)\s\d{3}-\d{4}"
                  title="Format: (555) 123-4567"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-base"
                  placeholder="example@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="school"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  School *
                </label>
                <DropDownInput
                    title={"School*"}
                    type={DropdownTypes.school}
                    value={school}
                    setValue={setSchool}
                  />
              </div>
              <div>
                <label
                  htmlFor="school"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  Level of Study *
                </label>
                <DropDownInput
                    title={"Level of Study*"}
                    type={DropdownTypes.levelsOfStudy}
                    value={levelOfStudy}
                    setValue={setLevelOfStudy}
                  />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3"
                >
                  Country of Residence *
                </label>
                <DropDownInput
                    title={"Country of Residence*"}
                    type={DropdownTypes.country}
                    value={country}
                    setValue={setCountry}
                  />
              </div>
              <div>
                <label
                  htmlFor="linkedIn"
                  className="block text-base sm:text-lg font-semibold tracking-wide text-white mb-2 sm:mb-3">
                    LinkedIn URL *
                </label>
                <input
                id="linkedIn"
                type="url"
                className="input-base"
                required
                >
                </input>
              </div>
              
            </div>

            <div className="mt-10">
               <p className="max-w-2xl text-center text-gray-100 text-3xl mt-4 mb-4 sm:text-2xl text-bold text-base">
              "We are currently in the process of partnering with MLH. The following 3 
              checkboxes are for this partnership. If we do not end up partnering with MLH, 
              your information will not be shared"
              </p>
            </div>
            <div className="flex flex-col space-y-4 justify-start items-start mt-10">
              <p className="max-w-2xl text-gray-100 text-5xl mt-4 mb-4 sm:text-xl text-base">
                "I have read and agree to the MLH Code of Conduct." (https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md)*
              </p>
              <div className="flex flex-row">
                <input type="checkbox" id="mlh-code-of-conduct" required className="mr-2 "/>
                <label htmlFor="mlh-code-of-conduct" className="text-gray-100">
                  I agree*
                </label>
              </div>
              <p className="max-w-2xl text-gray-100 text-1xl mt-4 mb-4 sm:text-xl text-base">
                “I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md). I further agree to the terms of both the MLH Contest Terms and Conditions 
                (https://github.com/MLH/mlh-policies/blob/main/contest-terms.md) and the MLH Privacy Policy 
                (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md).”*
              </p>
              <div className="flex flex-row">
                <input type="checkbox" id="mlh-code-of-conduct" required className="mr-2 " />
                <label htmlFor="mlh-code-of-conduct" className="text-gray-100">
                  I agree*
                </label>
              </div>
              <p className="max-w-2xl text-gray-100 text-1xl mt-4 mb-4 sm:text-xl text-base">
                “I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements."
              </p>
              <div className="flex flex-row">
                <input type="checkbox" id="mlh-code-of-conduct" required className="mr-2 " />
                <label htmlFor="mlh-code-of-conduct" className="text-gray-100">
                  I agree*
                </label>
              </div>
            </div>
            

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="text-white font-semibold rounded-full border-2 border-[#E3C676] px-8 py-3 hover:bg-[#E3C676] hover:text-black transition-colors hover:cursor-pointer text-2xl"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
