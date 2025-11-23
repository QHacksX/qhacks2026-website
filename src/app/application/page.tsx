"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  applicationApi,
  ApplicationCreatePayload,
  LevelOfStudy,
  HTTPError,
  UserFlags,
  authApi,
  Application,
  ApplicationStatus,
  hasFlag,
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import AnimatedStars from "@/components/ui/3d-models/Star";
import { IoIosClose, IoIosWarning, IoIosCheckmarkCircle } from "react-icons/io";
import { CgSpinner } from "react-icons/cg";
import Link from "next/link";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DropDownInput, { OptionType } from "@/components/dropdown";
import { DropdownTypes, dropdownOptions } from "@/data/dropdown-options/option";

const ApplicationPage = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    _hasHydrated,
    user,
    update: updateUser,
  } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schools, setSchools] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Application State
  const [existingApplication, setExistingApplication] =
    useState<Application | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ApplicationCreatePayload>>({
    country: "",
    city: "",
    age: undefined,
    phone: "",
    levelOfStudy: undefined as unknown as LevelOfStudy,
    major: "",
    school: "",
    schoolEmail: null,
    questions: {
      whyJoin: "",
      projectIdea: "",
      experience: "",
    },
    potentialTeammates: [],
    githubUrl: "",
    linkedinUrl: "",
    personalUrl: "",
    travelRequired: false,
    dietaryRestrictions: "",
    shirtSize: undefined as unknown as undefined,
    underrepresented: false,
    gender: "" as unknown as undefined,
    sexualIdentity: "",
    pronouns: "",
    ethnicity: "",
  });

  const [resume, setResume] = useState<File | null>(null);
  const [teammateInput, setTeammateInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Personal Information",
    "Education",
    "Hacker Profile",
    "Questions",
    "Logistics",
    "Demographics",
    "Teammates",
  ];

  const schoolOptions = useMemo(
    () => [
      { value: "", label: "Not Listed" },
      ...schools.map((s) => ({ value: s })),
    ],
    [schools],
  );

  const getOption = (
    type: DropdownTypes | undefined,
    value: string | number | undefined,
    customOptions?: OptionType[],
  ): OptionType | null => {
    if (value === undefined || value === null) return null;
    const options =
      customOptions ||
      (type !== undefined ? dropdownOptions.get(type)?.options : []);

    const foundOption = options?.find((o) => o.value === value);
    if (foundOption) return foundOption;

    if (value === "") return null;

    return {
      value,
      label: String(value),
    };
  };

  const handleDropdownChange = (name: string, option: OptionType | null) => {
    const value = option?.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // @eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateField = (
    name: string,
    value: string | number | undefined | null,
  ): string => {
    switch (name) {
      case "city":
        if (typeof value === "string" && value.length < 2)
          return "City must be at least 2 characters";
        if (typeof value === "string" && value.length > 168)
          return "City must be less than 168 characters";
        break;
      case "age":
        if (value !== undefined) {
          if (Number(value) < 13) return "You must be at least 13 years old";
          if (Number(value) > 120) return "Please enter a valid age";
        }
        break;
      case "phone":
        if (typeof value === "string" && value && !isValidPhoneNumber(value))
          return "Invalid phone number";
        break;
      case "schoolEmail":
        if (typeof value === "string" && value) {
          if (value.length < 5) return "Email must be at least 5 characters";
          if (value.length > 255)
            return "Email must be less than 255 characters";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return "Invalid email address";
        }
        break;
      case "githubUrl":
      case "linkedinUrl":
      case "personalUrl":
        if (typeof value === "string" && value) {
          if (value.length < 5) return "URL must be at least 5 characters";
          if (value.length > 255) return "URL must be less than 255 characters";
          if (!/^https?:\/\//.test(value))
            return "URL must start with http:// or https://";
        }
        break;
      case "major":
      case "sexualIdentity":
        if (typeof value === "string" && value && value.length > 64)
          return "Must be less than 64 characters";
        break;
      case "pronouns":
        if (typeof value === "string" && value && value.length > 16)
          return "Must be less than 16 characters";
        break;
      case "dietaryRestrictions":
      case "ethnicity":
        if (typeof value === "string" && value && value.length > 255)
          return "Must be less than 255 characters";
        break;
      case "whyJoin":
      case "projectIdea":
      case "experience":
        if (typeof value === "string" && value) {
          if (value.length < 10) return "Must be at least 10 characters";
          if (value.length > 3000) return "Must be less than 3000 characters";
        }
        break;
    }
    return "";
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          !!formData.country &&
          !!formData.city &&
          formData.city.length >= 2 &&
          formData.city.length <= 168 &&
          !!formData.age &&
          formData.age >= 13 &&
          formData.age <= 120 &&
          !!formData.phone &&
          formData.phone.length >= 2 &&
          formData.phone.length <= 20 &&
          isValidPhoneNumber(formData.phone)
        );
      case 1: // Education
        if (formData.levelOfStudy === undefined) return false;
        if (formData.school && !formData.schoolEmail) return false;
        if (
          formData.schoolEmail &&
          (formData.schoolEmail.length < 5 ||
            formData.schoolEmail.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.schoolEmail))
        )
          return false;
        if (formData.major && formData.major.length > 64) return false;
        return true;
      case 2: // Hacker Profile
        if (!resume) return false;
        if (
          formData.githubUrl &&
          (formData.githubUrl.length < 5 ||
            formData.githubUrl.length > 255 ||
            !/^https?:\/\//.test(formData.githubUrl))
        )
          return false;
        if (
          formData.linkedinUrl &&
          (formData.linkedinUrl.length < 5 ||
            formData.linkedinUrl.length > 255 ||
            !/^https?:\/\//.test(formData.linkedinUrl))
        )
          return false;
        if (
          formData.personalUrl &&
          (formData.personalUrl.length < 5 ||
            formData.personalUrl.length > 255 ||
            !/^https?:\/\//.test(formData.personalUrl))
        )
          return false;
        return true;
      case 3: // Questions
        return (
          !!formData.questions?.whyJoin &&
          formData.questions.whyJoin.length >= 10 &&
          formData.questions.whyJoin.length <= 3000 &&
          !!formData.questions?.projectIdea &&
          formData.questions.projectIdea.length >= 10 &&
          formData.questions.projectIdea.length <= 3000 &&
          (!formData.questions?.experience ||
            (formData.questions.experience.length >= 10 &&
              formData.questions.experience.length <= 3000))
        );
      case 4: // Logistics
        if (!formData.shirtSize) return false;
        if (
          formData.dietaryRestrictions &&
          formData.dietaryRestrictions.length > 255
        )
          return false;
        return true;
      case 5: // Demographics
        if (formData.pronouns && formData.pronouns.length > 16) return false;
        if (formData.ethnicity && formData.ethnicity.length > 255) return false;
        if (formData.sexualIdentity && formData.sexualIdentity.length > 64)
          return false;
        return true;
      case 6: // Teammates
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace("/login?redirect_to=/application");
      return;
    }

    const loadData = async () => {
      try {
        const promises: Promise<void | undefined>[] = [];
        promises.push(applicationApi.listSchools().then(setSchools));
        if (hasFlag(user, UserFlags.Applied)) {
          promises.push(applicationApi.getMe().then(setExistingApplication));
        }
        await Promise.allSettled(promises);
      } catch (error) {
        console.error("Failed to load application data", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, _hasHydrated, router, updateUser, user]);

  if (!_hasHydrated) return null;

  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    try {
      await authApi.resendVerification();
      toast.success("Verification email sent!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification email.");
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      questions: { ...prev.questions!, [name]: value },
    }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [`questions.${name}`]: error }));
  };

  const handleTeammateAdd = () => {
    if (
      teammateInput.trim().length >= 2 &&
      teammateInput.trim().length <= 100 &&
      (formData.potentialTeammates?.length || 0) < 3
    ) {
      setFormData((prev) => ({
        ...prev,
        potentialTeammates: [
          ...(prev.potentialTeammates || []),
          teammateInput.trim(),
        ],
      }));
      setTeammateInput("");
    }
  };

  const handleTeammateRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      potentialTeammates: prev.potentialTeammates?.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setIsLoading(true);

    if (!resume) {
      setGeneralError("Please upload your resume.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { ...formData };
      if (!payload.ethnicity) delete payload.ethnicity;
      if (!payload.sexualIdentity) delete payload.sexualIdentity;
      if (!payload.gender) delete payload.gender;

      const app = await applicationApi.create(
        payload as ApplicationCreatePayload,
        resume,
      );
      setExistingApplication(app);
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      if (error instanceof HTTPError) {
        if (error.isFormError() && Array.isArray(error.errors)) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          setErrors(newErrors);
          setGeneralError(
            "Errors have been found in your responses. Please review and try again.",
          );
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 text-white transition-colors hover:text-[#E3C676] sm:top-6 sm:left-6"
      >
        <IoIosClose size={40} className="sm:h-12 sm:w-12" />
      </Link>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#020202] to-[#2B2929]">
        <AnimatedStars />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-[#E3C676] sm:text-4xl lg:text-5xl">
          {existingApplication || isSubmitted
            ? "Application Status"
            : "Apply Now"}
        </h1>

        {isPageLoading ? (
          <div className="flex items-center justify-center py-20">
            <CgSpinner className="animate-spin text-6xl text-[#E3C676]" />
          </div>
        ) : !hasFlag(user, UserFlags.VerifiedEmail) ? (
          <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <div className="flex justify-center">
              <IoIosWarning className="text-6xl text-[#E3C676]" />
            </div>
            <h2 className="text-2xl font-semibold">
              Email Verification Required
            </h2>
            <p className="mx-auto max-w-md text-white/70">
              Please verify your email address before applying. Check your inbox
              for the verification link.
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isResendingEmail}
              className="rounded-xl bg-[#E3C676] px-8 py-3 font-bold text-black shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isResendingEmail ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>
        ) : existingApplication ? (
          <div className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            {isSubmitted && (
              <div className="space-y-2 rounded-xl border border-green-500/50 bg-green-500/10 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <IoIosCheckmarkCircle className="text-5xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-green-500">
                  Thank You for Applying!
                </h2>
                <p className="text-white/80">
                  Your application has been received. We will review it shortly.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="mb-1 text-sm text-white/50">Application Status</p>
                <p className="text-xl font-semibold capitalize">
                  {ApplicationStatus[existingApplication.status]}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="mb-1 text-sm text-white/50">Submitted On</p>
                <p className="text-xl font-semibold">
                  {new Date(existingApplication.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>

            {existingApplication.status === ApplicationStatus.Accepted && (
              <div className="flex justify-center pt-4">
                <Link
                  href="https://dashboard.qhacks.io"
                  className="font-medium text-[#E3C676] hover:underline"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
          >
            {/* Personal Information */}
            {currentStep === 0 && (
              <section className="space-y-4">
                <h2 className="border-b border-white/10 pb-2 text-xl font-semibold text-[#E3C676]">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <DropDownInput
                      title="Select a country"
                      type={DropdownTypes.country}
                      value={getOption(DropdownTypes.country, formData.country)}
                      onChange={(opt) => handleDropdownChange("country", opt)}
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.country}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      required
                      minLength={2}
                      maxLength={168}
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="age"
                      type="number"
                      value={formData.age || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      required
                      min={13}
                      max={120}
                    />
                    {errors.age && (
                      <p className="mt-1 text-xs text-red-500">{errors.age}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          phone: value || "",
                        }));
                        const error = validateField("phone", value);
                        setErrors((prev) => ({ ...prev, phone: error }));
                      }}
                      defaultCountry="CA"
                      className="phone-input-container"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Education */}
            {currentStep === 1 && (
              <section className="space-y-4">
                <h2 className="border-b border-white/10 pb-2 text-xl font-semibold text-[#E3C676]">
                  Education
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Level of Study <span className="text-red-500">*</span>
                    </label>
                    <DropDownInput
                      title="Select level of study"
                      type={DropdownTypes.levelsOfStudy}
                      value={getOption(
                        DropdownTypes.levelsOfStudy,
                        formData.levelOfStudy,
                      )}
                      onChange={(opt) =>
                        handleDropdownChange("levelOfStudy", opt)
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      School
                    </label>
                    <DropDownInput
                      title="Select your school"
                      options={schoolOptions}
                      value={getOption(
                        undefined,
                        formData.school,
                        schoolOptions,
                      )}
                      onChange={(opt) => handleDropdownChange("school", opt)}
                    />
                    {errors.school && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.school}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Major
                    </label>
                    <input
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      maxLength={64}
                    />
                    {errors.major && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.major}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      School Email{" "}
                      {formData.school && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      name="schoolEmail"
                      type="email"
                      value={formData.schoolEmail || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      maxLength={255}
                      required={!!formData.school}
                    />
                    {errors.schoolEmail && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.schoolEmail}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Hacker Profile */}
            {currentStep === 2 && (
              <section className="space-y-4">
                <h2 className="border-b border-white/10 pb-2 text-xl font-semibold text-[#E3C676]">
                  Hacker Profile
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      GitHub URL
                    </label>
                    <input
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      maxLength={255}
                      placeholder="https://github.com/..."
                    />
                    {errors.githubUrl && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.githubUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      LinkedIn URL
                    </label>
                    <input
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      maxLength={255}
                      placeholder="https://linkedin.com/in/..."
                    />
                    {errors.linkedinUrl && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.linkedinUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Personal Website
                    </label>
                    <input
                      name="personalUrl"
                      value={formData.personalUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      maxLength={255}
                      placeholder="https://..."
                    />
                    {errors.personalUrl && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.personalUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Resume (max 10 MB) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-1.5 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#E3C676] file:px-4 file:py-1 file:text-sm file:font-semibold file:text-black hover:file:bg-[#d4b86a] focus:border-[#E3C676]"
                      required
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Questions */}
            {currentStep === 3 && (
              <section className="space-y-4">
                <h2 className="border-b border-white/10 pb-2 text-xl font-semibold text-[#E3C676]">
                  Questions
                </h2>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Why do you want to join QHacks?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="whyJoin"
                    value={formData.questions?.whyJoin}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.whyJoin"] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors["questions.whyJoin"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    What project idea do you have?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="projectIdea"
                    value={formData.questions?.projectIdea}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.projectIdea"] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors["questions.projectIdea"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tell us about your hacker experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.questions?.experience}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.experience"] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors["questions.experience"]}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Logistics */}
            {currentStep === 4 && (
              <section className="space-y-4">
                <h2 className="border-b border-white/10 pb-2 text-xl font-semibold text-[#E3C676]">
                  Logistics
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Shirt Size <span className="text-red-500">*</span>
                    </label>
                    <DropDownInput
                      title="Select shirt size"
                      type={DropdownTypes.shirtSize}
                      value={getOption(
                        DropdownTypes.shirtSize,
                        formData.shirtSize,
                      )}
                      onChange={(opt) => handleDropdownChange("shirtSize", opt)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Dietary Restrictions
                    </label>
                    <input
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      maxLength={255}
                    />
                    {errors.dietaryRestrictions && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.dietaryRestrictions}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="travelRequired"
                      checked={formData.travelRequired}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          travelRequired: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[#E3C676]"
                    />
                    <label className="text-sm font-medium">
                      Travel Reimbursement Required?
                    </label>
                  </div>
                </div>
              </section>
            )}

            {/* Demographics */}
            {currentStep === 5 && (
              <section className="space-y-4">
                <h2 className="border-b border-white/10 pb-2 text-xl font-semibold text-[#E3C676]">
                  Demographics (Optional)
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Gender
                    </label>
                    <DropDownInput
                      title="Select gender"
                      type={DropdownTypes.gender}
                      value={getOption(DropdownTypes.gender, formData.gender)}
                      onChange={(opt) => handleDropdownChange("gender", opt)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Pronouns
                    </label>
                    <input
                      name="pronouns"
                      value={formData.pronouns}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      maxLength={16}
                    />
                    {errors.pronouns && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.pronouns}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Ethnicity
                    </label>
                    <DropDownInput
                      title="Select ethnicity"
                      type={DropdownTypes.ethnicity}
                      value={getOption(
                        DropdownTypes.ethnicity,
                        formData.ethnicity,
                      )}
                      onChange={(opt) => handleDropdownChange("ethnicity", opt)}
                    />
                    {errors.ethnicity && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.ethnicity}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Sexual Identity
                    </label>
                    <DropDownInput
                      title="Select sexual identity"
                      type={DropdownTypes.sexualIdentity}
                      value={getOption(
                        DropdownTypes.sexualIdentity,
                        formData.sexualIdentity,
                      )}
                      onChange={(opt) =>
                        handleDropdownChange("sexualIdentity", opt)
                      }
                    />
                    {errors.sexualIdentity && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.sexualIdentity}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      name="underrepresented"
                      checked={formData.underrepresented}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          underrepresented: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[#E3C676]"
                    />
                    <label className="text-sm font-medium">
                      Do you identify as part of an underrepresented group in
                      tech?
                    </label>
                  </div>
                </div>
              </section>
            )}

            {/* Teammates */}
            {currentStep === 6 && (
              <section className="space-y-4">
                <h2 className="border-b border-white/10 pb-2 text-xl font-semibold text-[#E3C676]">
                  Potential Teammates
                </h2>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={teammateInput}
                      onChange={(e) => setTeammateInput(e.target.value)}
                      placeholder="Enter teammate name"
                      className="flex-1 rounded-lg border border-white/20 bg-black/20 p-2 outline-none focus:border-[#E3C676]"
                      disabled={(formData.potentialTeammates?.length || 0) >= 3}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={handleTeammateAdd}
                      disabled={(formData.potentialTeammates?.length || 0) >= 3}
                      className="rounded-lg bg-[#E3C676] px-4 py-2 font-semibold text-black disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.potentialTeammates?.map((teammate, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1"
                      >
                        <span>{teammate}</span>
                        <button
                          type="button"
                          onClick={() => handleTeammateRemove(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.potentialTeammates && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.potentialTeammates}
                    </p>
                  )}
                </div>
              </section>
            )}

            {generalError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                <IoIosWarning className="shrink-0 text-xl text-red-500" />
                <p className="text-sm font-medium text-red-500">
                  {generalError}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="flex-1 rounded-xl bg-white/10 py-4 font-bold text-white shadow-lg transition-colors hover:bg-white/20"
                  >
                    Previous
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={!isStepValid()}
                    className="flex-1 rounded-xl bg-[#E3C676] py-4 font-bold text-black shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !isStepValid()}
                    className="flex-1 rounded-xl bg-[#E3C676] py-4 font-bold text-black shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-2 h-2.5 w-full rounded-full bg-white/10">
                <div
                  className="h-2.5 rounded-full bg-[#E3C676] transition-all duration-300 ease-in-out"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-white/50">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
