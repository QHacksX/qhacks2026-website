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
    shirtSize: undefined as unknown as "M",
    underrepresented: false,
    gender: "" as any,
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

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "city":
        if (value && value.length < 2)
          return "City must be at least 2 characters";
        if (value && value.length > 168)
          return "City must be less than 168 characters";
        break;
      case "age":
        if (value !== undefined) {
          if (value < 13) return "You must be at least 13 years old";
          if (value > 120) return "Please enter a valid age";
        }
        break;
      case "phone":
        if (value && !isValidPhoneNumber(value)) return "Invalid phone number";
        break;
      case "schoolEmail":
        if (value) {
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
        if (value) {
          if (value.length < 5) return "URL must be at least 5 characters";
          if (value.length > 255) return "URL must be less than 255 characters";
          if (!/^https?:\/\//.test(value))
            return "URL must start with http:// or https://";
        }
        break;
      case "major":
      case "sexualIdentity":
        if (value && value.length > 64)
          return "Must be less than 64 characters";
        break;
      case "pronouns":
        if (value && value.length > 16)
          return "Must be less than 16 characters";
        break;
      case "dietaryRestrictions":
      case "ethnicity":
        if (value && value.length > 255)
          return "Must be less than 255 characters";
        break;
      case "whyJoin":
      case "projectIdea":
      case "experience":
        if (value) {
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
        const promises: Promise<any>[] = [];
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
  }, [isAuthenticated, _hasHydrated, router, updateUser]);

  if (!_hasHydrated) return null;

  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    try {
      await authApi.resendVerification();
      toast.success("Verification email sent!");
    } catch (error) {
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
            let field = err.field;

            // Handle array types (e.g. potential_teammates.0 -> potential_teammates)
            if (field.includes(".")) {
              const parts = field.split(".");
              // If the part after dot is a number, strip it
              if (!isNaN(Number(parts[parts.length - 1]))) {
                parts.pop();
                field = parts.join(".");
              }
            }

            // Convert snake_case to camelCase for field matching
            field = field.replace(/_([a-z])/g, (_, letter) =>
              letter.toUpperCase(),
            );
            newErrors[field] = err.message;
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
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 text-white hover:text-[#E3C676] transition-colors"
      >
        <IoIosClose size={40} className="sm:w-12 sm:h-12" />
      </Link>

      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#2B2929] pointer-events-none">
        <AnimatedStars />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#E3C676] text-center mb-8">
          {existingApplication || isSubmitted
            ? "Application Status"
            : "Apply Now"}
        </h1>

        {isPageLoading ? (
          <div className="flex justify-center items-center py-20">
            <CgSpinner className="animate-spin text-[#E3C676] text-6xl" />
          </div>
        ) : !hasFlag(user, UserFlags.VerifiedEmail) ? (
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm text-center space-y-6">
            <div className="flex justify-center">
              <IoIosWarning className="text-[#E3C676] text-6xl" />
            </div>
            <h2 className="text-2xl font-semibold">
              Email Verification Required
            </h2>
            <p className="text-white/70 max-w-md mx-auto">
              Please verify your email address before applying. Check your inbox
              for the verification link.
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isResendingEmail}
              className="bg-[#E3C676] text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {isResendingEmail ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>
        ) : existingApplication ? (
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm space-y-8">
            {isSubmitted && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-6 text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <IoIosCheckmarkCircle className="text-green-500 text-5xl" />
                </div>
                <h2 className="text-2xl font-bold text-green-500">
                  Thank You for Applying!
                </h2>
                <p className="text-white/80">
                  Your application has been received. We will review it shortly.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50 mb-1">Application Status</p>
                <p className="text-xl font-semibold capitalize">
                  {ApplicationStatus[existingApplication.status]}
                </p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50 mb-1">Submitted On</p>
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
                  className="text-[#E3C676] hover:underline font-medium"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            {/* Personal Information */}
            {currentStep === 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-[#E3C676] border-b border-white/10 pb-2">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <DropDownInput
                      title="Select a country"
                      type={DropdownTypes.country}
                      value={getOption(DropdownTypes.country, formData.country)}
                      onChange={(opt) => handleDropdownChange("country", opt)}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      required
                      minLength={2}
                      maxLength={168}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="age"
                      type="number"
                      value={formData.age || ""}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      required
                      min={13}
                      max={120}
                    />
                    {errors.age && (
                      <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      placeholder="Enter phone number"
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
                      <p className="text-red-500 text-xs mt-1">
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
                <h2 className="text-xl font-semibold text-[#E3C676] border-b border-white/10 pb-2">
                  Education
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                    <label className="block text-sm font-medium mb-1">
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.school}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Major
                    </label>
                    <input
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      maxLength={64}
                    />
                    {errors.major && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.major}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      School Email
                    </label>
                    <input
                      name="schoolEmail"
                      type="email"
                      value={formData.schoolEmail || ""}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      maxLength={255}
                      required={!!formData.school}
                    />
                    {errors.schoolEmail && (
                      <p className="text-red-500 text-xs mt-1">
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
                <h2 className="text-xl font-semibold text-[#E3C676] border-b border-white/10 pb-2">
                  Hacker Profile
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      GitHub URL
                    </label>
                    <input
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      maxLength={255}
                      placeholder="https://github.com/..."
                    />
                    {errors.githubUrl && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.githubUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      maxLength={255}
                      placeholder="https://linkedin.com/in/..."
                    />
                    {errors.linkedinUrl && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.linkedinUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Personal Website
                    </label>
                    <input
                      name="personalUrl"
                      value={formData.personalUrl}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      maxLength={255}
                      placeholder="https://..."
                    />
                    {errors.personalUrl && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.personalUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Resume (PDF, max 25MB){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-1.5 focus:border-[#E3C676] outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E3C676] file:text-black hover:file:bg-[#d4b86a]"
                      required
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Questions */}
            {currentStep === 3 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-[#E3C676] border-b border-white/10 pb-2">
                  Questions
                </h2>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Why do you want to join QHacks?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="whyJoin"
                    value={formData.questions?.whyJoin}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.whyJoin"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["questions.whyJoin"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    What project idea do you have?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="projectIdea"
                    value={formData.questions?.projectIdea}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.projectIdea"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["questions.projectIdea"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tell us about your hacker experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.questions?.experience}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.experience"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors["questions.experience"]}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Logistics */}
            {currentStep === 4 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-[#E3C676] border-b border-white/10 pb-2">
                  Logistics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                    <label className="block text-sm font-medium mb-1">
                      Dietary Restrictions
                    </label>
                    <input
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      maxLength={255}
                    />
                    {errors.dietaryRestrictions && (
                      <p className="text-red-500 text-xs mt-1">
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
                      className="w-4 h-4 accent-[#E3C676]"
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
                <h2 className="text-xl font-semibold text-[#E3C676] border-b border-white/10 pb-2">
                  Demographics (Optional)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                    <label className="block text-sm font-medium mb-1">
                      Pronouns
                    </label>
                    <input
                      name="pronouns"
                      value={formData.pronouns}
                      onChange={handleInputChange}
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      maxLength={16}
                    />
                    {errors.pronouns && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pronouns}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ethnicity}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
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
                      <p className="text-red-500 text-xs mt-1">
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
                      className="w-4 h-4 accent-[#E3C676]"
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
                <h2 className="text-xl font-semibold text-[#E3C676] border-b border-white/10 pb-2">
                  Potential Teammates
                </h2>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={teammateInput}
                      onChange={(e) => setTeammateInput(e.target.value)}
                      placeholder="Enter teammate name"
                      className="flex-1 bg-black/20 border border-white/20 rounded-lg p-2 focus:border-[#E3C676] outline-none"
                      disabled={(formData.potentialTeammates?.length || 0) >= 3}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={handleTeammateAdd}
                      disabled={(formData.potentialTeammates?.length || 0) >= 3}
                      className="bg-[#E3C676] text-black px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.potentialTeammates?.map((teammate, index) => (
                      <div
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2"
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors.potentialTeammates}
                    </p>
                  )}
                </div>
              </section>
            )}

            {generalError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                <IoIosWarning className="text-red-500 text-xl shrink-0" />
                <p className="text-red-500 text-sm font-medium">
                  {generalError}
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-4">
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-white/20 transition-colors"
                  >
                    Previous
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={!isStepValid()}
                    className="flex-1 bg-[#E3C676] text-black font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !isStepValid()}
                    className="flex-1 bg-[#E3C676] text-black font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2.5 mt-2">
                <div
                  className="bg-[#E3C676] h-2.5 rounded-full transition-all duration-300 ease-in-out"
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
