"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FaCircle } from "react-icons/fa";
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
  const { isAuthenticated, _hasHydrated, user, update: updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schools, setSchools] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Application State
  const [existingApplication, setExistingApplication] = useState<Application | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState<
    Partial<ApplicationCreatePayload> & {
      mlhCodeOfConduct?: boolean;
      mlhPrivacyPolicy?: boolean;
    }
  >({
    country: "",
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
    mlhCodeOfConduct: false,
    mlhPrivacyPolicy: false,
    mlhEmails: false,
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
    "MLH Policies",
  ];

  const schoolOptions = useMemo(
    () => [{ value: "", label: "Not Listed" }, ...schools.map((s) => ({ value: s }))],
    [schools],
  );

  const getOption = (
    type: DropdownTypes | undefined,
    value: string | number | undefined,
    customOptions?: OptionType[],
  ): OptionType | null => {
    if (value === undefined || value === null) return null;
    const options = customOptions || (type !== undefined ? dropdownOptions.get(type)?.options : []);

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
  const validateField = (name: string, value: string | number | undefined | null): string => {
    switch (name) {
      case "age":
        if (value !== undefined) {
          if (Number(value) < 13) return "You must be at least 13 years old";
          if (Number(value) > 120) return "Please enter a valid age";
        }
        break;
      case "phone":
        if (typeof value === "string" && value && !isValidPhoneNumber(value)) return "Invalid phone number";
        break;
      case "schoolEmail":
        if (typeof value === "string" && value) {
          if (value.length < 5) return "Email must be at least 5 characters";
          if (value.length > 255) return "Email must be less than 255 characters";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        }
        break;
      case "githubUrl":
      case "linkedinUrl":
      case "personalUrl":
        if (typeof value === "string" && value) {
          if (value.length < 5) return "URL must be at least 5 characters";
          if (value.length > 255) return "URL must be less than 255 characters";
          if (!/^https?:\/\//.test(value)) return "URL must start with http:// or https://";
        }
        break;
      case "major":
      case "sexualIdentity":
        if (typeof value === "string" && value && value.length > 64) return "Must be less than 64 characters";
        break;
      case "pronouns":
        if (typeof value === "string" && value && value.length > 16) return "Must be less than 16 characters";
        break;
      case "dietaryRestrictions":
      case "ethnicity":
        if (typeof value === "string" && value && value.length > 255) return "Must be less than 255 characters";
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
          (formData.githubUrl.length < 5 || formData.githubUrl.length > 255 || !/^https?:\/\//.test(formData.githubUrl))
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
            (formData.questions.experience.length >= 10 && formData.questions.experience.length <= 3000))
        );
      case 4: // Logistics
        if (!formData.shirtSize) return false;
        if (formData.dietaryRestrictions && formData.dietaryRestrictions.length > 255) return false;
        return true;
      case 5: // Demographics
        if (formData.pronouns && formData.pronouns.length > 16) return false;
        if (formData.ethnicity && formData.ethnicity.length > 255) return false;
        if (formData.sexualIdentity && formData.sexualIdentity.length > 64) return false;
        return true;
      case 6: // Teammates
        return true;
      case 7: // MLH Policies
        return !!formData.mlhCodeOfConduct && !!formData.mlhPrivacyPolicy;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (!_hasHydrated) return;

    // if (!isAuthenticated || !user) {
    //   router.replace("/login?redirect_to=/application");
    //   return;
    // }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        potentialTeammates: [...(prev.potentialTeammates || []), teammateInput.trim()],
      }));
      setTeammateInput("");
    }
  };

  const handleTeammateRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      potentialTeammates: prev.potentialTeammates?.filter((_, i) => i !== index),
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
      delete payload.mlhCodeOfConduct;
      delete payload.mlhPrivacyPolicy;

      const app = await applicationApi.create(payload as ApplicationCreatePayload, resume);
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
          setGeneralError("Errors have been found in your responses. Please review and try again.");
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentStep((prev) => prev + newDirection);
  };

  // Noise overlay component
  const NoiseOverlay = () => (
    <div
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        filter: "grayscale(100%)",
      }}
    />
  );

  if (!_hasHydrated) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-[#E3C676] selection:text-black">
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 text-white/70 transition-all hover:scale-110 hover:text-[#E3C676]"
      >
        <IoIosClose size={40} className="drop-shadow-lg sm:h-12 sm:w-12" />
      </Link>

      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#020202] to-[#000000]"></div>
        <AnimatedStars />
        <NoiseOverlay />
        {/* Vintage Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)] z-[2]"></div>
        {/* Film Scratch Overlay (Subtle) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse z-[2]"></div>
      </div>

      {/* REC Indicator - Top Right */}
      <motion.div 
        className="fixed top-8 right-8 z-50 flex items-center gap-3"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaCircle className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" size={14} />
        <span className="font-mono text-xl font-bold tracking-[0.2em] text-white/90 drop-shadow-md">REC</span>
      </motion.div>

      <div className="relative z-10 container mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 text-center font-mono text-3xl font-bold tracking-tight text-[#E3C676] sm:text-4xl lg:text-5xl"
          style={{ textShadow: "0 0 20px rgba(227, 198, 118, 0.3)" }}
        >
          {existingApplication || isSubmitted ? "Application Status" : "Apply Now"}
        </motion.h1>

        {isPageLoading ? (
          <div className="flex items-center justify-center py-20">
            <CgSpinner className="animate-spin text-6xl text-[#E3C676]" />
          </div>
        ) : !hasFlag(user, UserFlags.VerifiedEmail) ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 rounded-2xl border border-[#E3C676]/20 bg-black/40 p-8 text-center backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-center">
              <IoIosWarning className="text-6xl text-[#E3C676] drop-shadow-lg" />
            </div>
            <h2 className="text-2xl font-semibold tracking-wide">Email Verification Required</h2>
            <p className="mx-auto max-w-md text-white/70">
              Please verify your email address before applying. Check your inbox for the verification link.
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isResendingEmail}
              className="rounded-xl bg-[#E3C676] px-8 py-3 font-bold text-black shadow-[0_0_15px_rgba(227,198,118,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(227,198,118,0.5)] disabled:opacity-50"
            >
              {isResendingEmail ? "Sending..." : "Resend Verification Email"}
            </button>
          </motion.div>
        ) : existingApplication ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 rounded-2xl border border-[#E3C676]/20 bg-black/40 p-8 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            {isSubmitted && (
              <div className="space-y-2 rounded-xl border border-green-500/30 bg-green-900/10 p-6 text-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <div className="mb-4 flex justify-center">
                  <IoIosCheckmarkCircle className="text-5xl text-green-500 drop-shadow-md" />
                </div>
                <h2 className="text-2xl font-bold text-green-400 tracking-wide">Thank You for Applying!</h2>
                <p className="text-white/80">Your application has been received. We will review it shortly.</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 transition-all hover:border-[#E3C676]/50 hover:bg-black/60">
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#E3C676]/70">Application Status</p>
                <p className="text-2xl font-bold capitalize text-white drop-shadow-md">{ApplicationStatus[existingApplication.status]}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 transition-all hover:border-[#E3C676]/50 hover:bg-black/60">
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[#E3C676]/70">Submitted On</p>
                <p className="text-2xl font-bold text-white drop-shadow-md">
                  {new Date(existingApplication.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {existingApplication.status === ApplicationStatus.Accepted && (
              <div className="flex justify-center pt-4">
                <Link href="https://dashboard.qhacks.io" className="group flex items-center gap-2 font-mono font-bold text-[#E3C676] transition-all hover:text-[#d4b86a]">
                  <span className="border-b-2 border-transparent transition-all group-hover:border-[#d4b86a]">Go to Dashboard</span>
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
          >
            {/* Movie Theater Screen Container */}
            <div className="relative rounded-3xl bg-[#080808] p-4 shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_30px_rgba(227,198,118,0.05)] ring-1 ring-white/5">
              {/* Inner Bezel */}
              <div className="relative overflow-hidden rounded-2xl bg-black shadow-[inset_0_0_40px_rgba(0,0,0,1)] border border-white/5">
                {/* Screen Reflection/Gloss */}
                <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent opacity-50 rounded-2xl"></div>
                
                <form
                  onSubmit={handleSubmit}
                  className="relative space-y-8 rounded-xl border-none bg-transparent p-6 sm:p-10 overflow-hidden"
                >
                  {/* Viewfinder Corners */}
                  <div className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#E3C676]/60"></div>
                  <div className="pointer-events-none absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-[#E3C676]/60"></div>
                  <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#E3C676]/60"></div>
                  <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-[#E3C676]/60"></div>
                  
                  {/* Crosshair Center */}
                  <div className="pointer-events-none absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform opacity-30">
                     <div className="absolute top-1/2 left-0 h-[1px] w-full bg-[#E3C676]"></div>
                     <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#E3C676]"></div>
                  </div>

                  <div className="relative overflow-hidden min-h-[300px] z-10">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                        }}
                        className="w-full"
                      >
                  {/* Personal Information */}
                  {currentStep === 0 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">Personal Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <DropDownInput
                      title="Select a country"
                      type={DropdownTypes.country}
                      value={getOption(DropdownTypes.country, formData.country)}
                      onChange={(opt) => handleDropdownChange("country", opt)}
                    />
                    {errors.country && <p className="mt-1 text-xs font-mono text-red-500">{errors.country}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
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
                      className="phone-input-container transition-all focus-within:ring-1 focus-within:ring-[#E3C676]"
                      placeholder="(000) 000-0000"
                      smartCaret
                    />
                    {errors.phone && <p className="mt-1 text-xs font-mono text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      required
                      min={13}
                      max={120}
                    />
                    {errors.age && <p className="mt-1 text-xs font-mono text-red-500">{errors.age}</p>}
                  </div>
                </div>
              </section>
            )}

            {/* Education */}
            {currentStep === 1 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">Education</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                      Level of Study <span className="text-red-500">*</span>
                    </label>
                    <DropDownInput
                      title="Select level of study"
                      type={DropdownTypes.levelsOfStudy}
                      value={getOption(DropdownTypes.levelsOfStudy, formData.levelOfStudy)}
                      onChange={(opt) => handleDropdownChange("levelOfStudy", opt)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">School</label>
                    <DropDownInput
                      title="Select your school"
                      options={schoolOptions}
                      value={getOption(undefined, formData.school, schoolOptions)}
                      onChange={(opt) => handleDropdownChange("school", opt)}
                    />
                    {errors.school && <p className="mt-1 text-xs font-mono text-red-500">{errors.school}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Major</label>
                    <input
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      maxLength={64}
                      placeholder="Enter your major"
                    />
                    {errors.major && <p className="mt-1 text-xs font-mono text-red-500">{errors.major}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                      School Email {formData.school && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      name="schoolEmail"
                      type="email"
                      value={formData.schoolEmail || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      maxLength={255}
                      required={!!formData.school}
                      placeholder="Enter your school email"
                    />
                    {errors.schoolEmail && <p className="mt-1 text-xs font-mono text-red-500">{errors.schoolEmail}</p>}
                  </div>
                </div>
              </section>
            )}

            {/* Hacker Profile */}
            {currentStep === 2 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">Hacker Profile</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">GitHub URL</label>
                    <input
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      maxLength={255}
                      placeholder="https://github.com/..."
                    />
                    {errors.githubUrl && <p className="mt-1 text-xs font-mono text-red-500">{errors.githubUrl}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">LinkedIn URL</label>
                    <input
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      maxLength={255}
                      placeholder="https://linkedin.com/in/..."
                    />
                    {errors.linkedinUrl && <p className="mt-1 text-xs font-mono text-red-500">{errors.linkedinUrl}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Personal Website</label>
                    <input
                      name="personalUrl"
                      value={formData.personalUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      maxLength={255}
                      placeholder="https://..."
                    />
                    {errors.personalUrl && <p className="mt-1 text-xs font-mono text-red-500">{errors.personalUrl}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                      Resume (max 10 MB) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-2 text-sm text-white outline-none file:mr-4 file:rounded-md file:border-0 file:bg-[#E3C676] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-black file:transition-colors hover:file:bg-[#d4b86a] focus:border-[#E3C676]"
                      required
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Questions */}
            {currentStep === 3 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">Questions</h2>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                    Why do you want to join QHacks? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="whyJoin"
                    value={formData.questions?.whyJoin}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.whyJoin"] && <p className="mt-1 text-xs font-mono text-red-500">{errors["questions.whyJoin"]}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                    What project idea do you have? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="projectIdea"
                    value={formData.questions?.projectIdea}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.projectIdea"] && (
                    <p className="mt-1 text-xs font-mono text-red-500">{errors["questions.projectIdea"]}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Tell us about your hacker experience</label>
                  <textarea
                    name="experience"
                    value={formData.questions?.experience}
                    onChange={handleQuestionChange}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                    minLength={10}
                    maxLength={3000}
                  />
                  {errors["questions.experience"] && (
                    <p className="mt-1 text-xs font-mono text-red-500">{errors["questions.experience"]}</p>
                  )}
                </div>
              </section>
            )}

            {/* Logistics */}
            {currentStep === 4 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">Logistics</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">
                      Shirt Size <span className="text-red-500">*</span>
                    </label>
                    <DropDownInput
                      title="Select shirt size"
                      type={DropdownTypes.shirtSize}
                      value={getOption(DropdownTypes.shirtSize, formData.shirtSize)}
                      onChange={(opt) => handleDropdownChange("shirtSize", opt)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Dietary Restrictions</label>
                    <input
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      maxLength={255}
                    />
                    {errors.dietaryRestrictions && <p className="mt-1 text-xs font-mono text-red-500">{errors.dietaryRestrictions}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
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
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-[#E3C676]/50 bg-black/40 checked:bg-[#E3C676] checked:border-[#E3C676] transition-all"
                      />
                      <IoIosCheckmarkCircle className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <label className="text-sm font-medium text-white/80">Are you travelling from outside of Queen's University?</label>
                  </div>
                </div>
              </section>
            )}

            {/* Demographics */}
            {currentStep === 5 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">
                  Demographics (Optional)
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Gender</label>
                    <DropDownInput
                      title="Select gender"
                      type={DropdownTypes.gender}
                      value={getOption(DropdownTypes.gender, formData.gender)}
                      onChange={(opt) => handleDropdownChange("gender", opt)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Pronouns</label>
                    <input
                      name="pronouns"
                      value={formData.pronouns}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      maxLength={16}
                    />
                    {errors.pronouns && <p className="mt-1 text-xs font-mono text-red-500">{errors.pronouns}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Ethnicity</label>
                    <DropDownInput
                      title="Select ethnicity"
                      type={DropdownTypes.ethnicity}
                      value={getOption(DropdownTypes.ethnicity, formData.ethnicity)}
                      onChange={(opt) => handleDropdownChange("ethnicity", opt)}
                    />
                    {errors.ethnicity && <p className="mt-1 text-xs font-mono text-red-500">{errors.ethnicity}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-[#E3C676]/80">Sexual Identity</label>
                    <DropDownInput
                      title="Select sexual identity"
                      type={DropdownTypes.sexualIdentity}
                      value={getOption(DropdownTypes.sexualIdentity, formData.sexualIdentity)}
                      onChange={(opt) => handleDropdownChange("sexualIdentity", opt)}
                    />
                    {errors.sexualIdentity && <p className="mt-1 text-xs font-mono text-red-500">{errors.sexualIdentity}</p>}
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <div className="relative flex items-center">
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
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-[#E3C676]/50 bg-black/40 checked:bg-[#E3C676] checked:border-[#E3C676] transition-all"
                      />
                      <IoIosCheckmarkCircle className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <label className="text-sm font-medium text-white/80">
                      Do you identify as part of an underrepresented group in tech?
                    </label>
                  </div>
                </div>
              </section>
            )}
            {/* Teammates */}
            {currentStep === 6 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">Potential Teammates</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      value={teammateInput}
                      onChange={(e) => setTeammateInput(e.target.value)}
                      placeholder="Enter teammate name"
                      className="flex-1 rounded-lg border border-white/10 bg-black/40 p-3 text-white outline-none transition-all focus:border-[#E3C676] focus:bg-black/60"
                      disabled={(formData.potentialTeammates?.length || 0) >= 3}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={handleTeammateAdd}
                      disabled={(formData.potentialTeammates?.length || 0) >= 3}
                      className="rounded-lg bg-[#E3C676] px-6 py-2 font-bold text-black shadow-[0_0_10px_rgba(227,198,118,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(227,198,118,0.4)] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.potentialTeammates?.map((teammate, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-full border border-[#E3C676]/30 bg-[#E3C676]/10 px-4 py-1 text-[#E3C676]">
                        <span>{teammate}</span>
                        <button
                          type="button"
                          onClick={() => handleTeammateRemove(index)}
                          className="ml-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.potentialTeammates && <p className="mt-1 text-xs font-mono text-red-500">{errors.potentialTeammates}</p>}
                </div>
              </section>
            )}

            {/* MLH Policies */}
            {currentStep === 7 && (
              <section className="space-y-6">
                <h2 className="border-b border-[#E3C676]/30 pb-2 text-xl font-bold tracking-wide text-[#E3C676]">MLH Policies</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="relative flex items-start pt-1">
                      <input
                        type="checkbox"
                        id="mlhCodeOfConduct"
                        checked={formData.mlhCodeOfConduct}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mlhCodeOfConduct: e.target.checked,
                          }))
                        }
                        className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-sm border border-[#E3C676]/50 bg-black/40 checked:bg-[#E3C676] checked:border-[#E3C676] transition-all"
                      />
                      <IoIosCheckmarkCircle className="pointer-events-none absolute left-0 top-1 h-5 w-5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <label htmlFor="mlhCodeOfConduct" className="text-sm text-white/80 leading-relaxed">
                      I have read and agree to the{" "}
                      <a
                        href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#E3C676] hover:underline"
                      >
                        MLH Code of Conduct
                      </a>
                      . <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="relative flex items-start pt-1">
                      <input
                        type="checkbox"
                        id="mlhPrivacyPolicy"
                        checked={formData.mlhPrivacyPolicy}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mlhPrivacyPolicy: e.target.checked,
                          }))
                        }
                        className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-sm border border-[#E3C676]/50 bg-black/40 checked:bg-[#E3C676] checked:border-[#E3C676] transition-all"
                      />
                      <IoIosCheckmarkCircle className="pointer-events-none absolute left-0 top-1 h-5 w-5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <label htmlFor="mlhPrivacyPolicy" className="text-sm text-white/80 leading-relaxed">
                      I authorize you to share my application/registration information with Major League Hacking for event
                      administration, ranking, and MLH administration in-line with the{" "}
                      <a
                        href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#E3C676] hover:underline"
                      >
                        MLH Privacy Policy
                      </a>
                      . I further agree to the terms of both the{" "}
                      <a
                        href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#E3C676] hover:underline"
                      >
                        MLH Contest Terms and Conditions
                      </a>{" "}
                      and the{" "}
                      <a
                        href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#E3C676] hover:underline"
                      >
                        MLH Privacy Policy
                      </a>
                      . <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="relative flex items-start pt-1">
                      <input
                        type="checkbox"
                        id="mlhEmails"
                        checked={formData.mlhEmails}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mlhEmails: e.target.checked,
                          }))
                        }
                        className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-sm border border-[#E3C676]/50 bg-black/40 checked:bg-[#E3C676] checked:border-[#E3C676] transition-all"
                      />
                      <IoIosCheckmarkCircle className="pointer-events-none absolute left-0 top-1 h-5 w-5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <label htmlFor="mlhEmails" className="text-sm text-white/80 leading-relaxed">
                      I authorize MLH to send me occasional emails about relevant events, career opportunities, and community
                      announcements.
                    </label>
                  </div>
                </div>
              </section>
            )}
                </motion.div>
              </AnimatePresence>
            </div>

            {generalError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4 backdrop-blur-sm"
              >
                <IoIosWarning className="shrink-0 text-xl text-red-500" />
                <p className="text-sm font-bold font-mono text-red-500 uppercase tracking-wide">{generalError}</p>
              </motion.div>
            )}

            <div className="flex flex-col gap-6 pt-4">
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    className="flex-1 rounded-xl border border-[#E3C676]/30 bg-black/40 py-4 font-bold uppercase tracking-widest text-[#E3C676] transition-all hover:bg-[#E3C676] hover:text-black hover:shadow-[0_0_15px_rgba(227,198,118,0.4)]"
                  >
                    Previous
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    disabled={!isStepValid()}
                    className="flex-1 rounded-xl bg-[#E3C676] py-4 font-bold uppercase tracking-widest text-black shadow-[0_0_10px_rgba(227,198,118,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(227,198,118,0.5)] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !isStepValid()}
                    className="flex-1 rounded-xl bg-[#E3C676] py-4 font-bold uppercase tracking-widest text-black shadow-[0_0_10px_rgba(227,198,118,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(227,198,118,0.5)] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </button>
                )}
              </div>

              {/* Progress Bar / Film Strip Timeline */}
              <div className="mt-6 relative h-8 w-full flex items-center justify-center">
                 {/* Film Sprockets Top */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-repeat-x opacity-30" style={{ backgroundImage: 'linear-gradient(to right, transparent 50%, #E3C676 50%)', backgroundSize: '10px 100%' }}></div>
                 
                 {/* Bar */}
                 <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#E3C676] shadow-[0_0_10px_#E3C676]"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                 </div>

                 {/* Film Sprockets Bottom */}
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-repeat-x opacity-30" style={{ backgroundImage: 'linear-gradient(to right, transparent 50%, #E3C676 50%)', backgroundSize: '10px 100%' }}></div>
              </div>

              <p className="text-center text-xs font-mono uppercase tracking-widest text-white/50 mt-2">
                <span className="mr-2 text-[#E3C676]">SCENE {currentStep + 1}</span> / {steps.length}: {steps[currentStep]}
              </p>
            </div>
          </form>
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
