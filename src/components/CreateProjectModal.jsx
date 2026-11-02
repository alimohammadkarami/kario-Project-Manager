import { useEffect, useRef, useState } from "react";

export function CreateProjectModal({
  isOpen,
  onClose,
  onSave,
}) {
  const nameRef = useRef(null);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // فیلد جدید تاریخ سررسید
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    setProjectName("");
    setDescription("");
    setDueDate("");
    setError("");
    setIsSaving(false);
  }, [isOpen]);

  // Focus project name on open
  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      nameRef.current?.focus();
    }, 120);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    const trimmedName = projectName.trim();
    const trimmedDescription = description.trim();
    const trimmedDueDate = dueDate.trim();

    if (!trimmedName) {
      setError("لطفاً نام پروژه را وارد کنید.");
      nameRef.current?.focus();
      return;
    }

    if (trimmedName.length < 3) {
      setError("نام پروژه باید حداقل ۳ کاراکتر باشد.");
      nameRef.current?.focus();
      return;
    }

    if (typeof onSave !== "function") {
      setError("امکان ثبت پروژه وجود ندارد.");
      return;
    }

    try {
      setError("");
      setIsSaving(true);

      await onSave({
        name: trimmedName,
        description: trimmedDescription,
        dueDate: trimmedDueDate, // ارسال تاریخ به تابع ذخیره
      });
    } catch (err) {
      setError(
        err?.message || "ثبت پروژه ناموفق بود. دوباره تلاش کنید."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        overflow-y-auto
        p-4 sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="بستن"
        disabled={isSaving}
        onClick={() => !isSaving && onClose()}
        className="
          absolute inset-0
          cursor-default
          bg-slate-950/25
          backdrop-blur-[3px]
          dark:bg-black/45
        "
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          flex w-full max-w-[440px]
          max-h-[calc(100dvh-2rem)]
          flex-col
          overflow-y-auto
          rounded-[28px]

          border border-white/70
          bg-white/85
          shadow-2xl shadow-slate-400/20
          backdrop-blur-2xl
          backdrop-saturate-150

          dark:border-white/10
          dark:bg-surface-dark/85
          dark:shadow-black/35
        "
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="بستن پنجره"
          className="
            absolute left-4 top-4 z-10
            flex h-9 w-9 items-center justify-center
            rounded-full
            text-slate-400
            transition-colors
            hover:bg-slate-100 hover:text-slate-600
            disabled:opacity-50
            dark:text-slate-500
            dark:hover:bg-white/8
            dark:hover:text-slate-200
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col px-6 pb-6 pt-9 sm:px-8"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div
              className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl
                bg-brand-50 text-brand-600
                dark:bg-brand-500/10 dark:text-brand-400
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M12 8v8M8 12h8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2
              id="create-project-title"
              className="
                mt-4 text-lg font-semibold
                text-slate-800
                dark:text-slate-100
              "
            >
              ایجاد پروژه جدید
            </h2>

            <p
              className="
                mt-1.5 max-w-[300px]
                text-sm leading-6
                text-slate-400 dark:text-slate-500
              "
            >
              پروژه جدید خود را تعریف کنید و شروع به کار کنید.
            </p>
          </div>

          {/* Form fields */}
          <div className="mt-8 space-y-5">
            {/* Project name */}
            <div>
              <label
                htmlFor="project-name"
                className="
                  mb-2 block
                  text-sm font-medium
                  text-slate-700
                  dark:text-slate-200
                "
              >
                نام پروژه
                <span className="mr-1 text-red-500">*</span>
              </label>

              <input
                ref={nameRef}
                id="project-name"
                type="text"
                value={projectName}
                onChange={(event) => {
                  setProjectName(event.target.value);
                  if (error) setError("");
                }}
                placeholder="مثلاً طراحی وب‌سایت فروشگاهی"
                autoComplete="off"
                maxLength={100}
                required
                disabled={isSaving}
                className="
                  h-13 w-full
                  rounded-xl
                  border border-slate-200
                  bg-white/70
                  px-4
                  text-sm text-slate-800
                  outline-none
                  placeholder:text-slate-300
                  transition-all duration-150

                  focus:border-brand-400
                  focus:ring-4 focus:ring-brand-500/10

                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                  dark:focus:border-brand-500
                  dark:focus:ring-brand-500/10
                "
              />

              <p className="
                mt-2 text-xs leading-5
                text-slate-400 dark:text-slate-500
              ">
                یک نام کوتاه و قابل تشخیص برای پروژه انتخاب کنید.
              </p>
            </div>

            {/* Optional description */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="project-description"
                  className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  توضیحات پروژه
                </label>

                <span className="
                  text-xs text-slate-400 dark:text-slate-500
                ">
                  اختیاری
                </span>
              </div>

              <textarea
                id="project-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  if (error) setError("");
                }}
                placeholder="هدف پروژه، جزئیات یا توضیحات تکمیلی..."
                rows={4}
                maxLength={1000}
                disabled={isSaving}
                className="
                  min-h-[112px] w-full
                  resize-y
                  rounded-xl
                  border border-slate-200
                  bg-white/70
                  px-4 py-3.5
                  text-sm leading-6
                  text-slate-800
                  outline-none
                  placeholder:text-slate-300
                  transition-all duration-150

                  focus:border-brand-400
                  focus:ring-4 focus:ring-brand-500/10

                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                  dark:focus:border-brand-500
                  dark:focus:ring-brand-500/10
                "
              />

              <div className="mt-1.5 flex justify-end">
                <span className="
                  text-xs text-slate-400 dark:text-slate-500
                ">
                  {description.length}/1000
                </span>
              </div>
            </div>

            {/* Due Date (فیلد تاریخ سررسید) */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="project-due-date"
                  className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  تاریخ سررسید
                </label>

                <span className="
                  text-xs text-slate-400 dark:text-slate-500
                ">
                  اختیاری
                </span>
              </div>

              <input
                id="project-due-date"
                type="text"
                value={dueDate}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  if (error) setError("");
                }}
                placeholder="1405-04-14"
                autoComplete="off"
                disabled={isSaving}
                className="
                  h-13 w-full
                  rounded-xl
                  border border-slate-200
                  bg-white/70
                  px-4
                  text-sm text-slate-800
                  outline-none
                  placeholder:text-slate-300
                  transition-all duration-150

                  focus:border-brand-400
                  focus:ring-4 focus:ring-brand-500/10

                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                  dark:focus:border-brand-500
                  dark:focus:ring-brand-500/10
                "
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="
                mt-4 rounded-xl
                border border-red-200/70
                bg-red-50/70 px-3 py-2.5
                text-xs leading-6 text-red-500
                dark:border-red-500/15
                dark:bg-red-500/5
                dark:text-red-400
              "
            >
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="mt-7 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="
                h-12 flex-1
                rounded-2xl
                border border-slate-200
                bg-white/60 px-4
                text-sm font-medium text-slate-600
                transition-colors hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-50
                dark:border-white/10
                dark:bg-white/5
                dark:text-slate-300
                dark:hover:bg-white/8
              "
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="
                flex h-12 flex-[1.5] items-center
                justify-center gap-2
                rounded-xl
                bg-brand-600 px-4
                text-sm font-medium text-white
                shadow-lg shadow-brand-600/15
                transition-all duration-150
                hover:bg-brand-700
                active:scale-[0.98]
                focus:outline-none
                focus:ring-4 focus:ring-brand-500/15
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {isSaving && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity=".25"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {isSaving ? "در حال ثبت..." : "ایجاد پروژه"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;