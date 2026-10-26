import { useEffect, useRef, useState } from "react";
import { ModifyPassword } from "../services/AuthService";

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSave,
}) {
  const currentPasswordRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowPasswords(false);
    setIsSaving(false);
  }, [isOpen]);

  // Focus first input
  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      currentPasswordRef.current?.focus();
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

    if (!currentPassword) {
      setError("لطفاً رمز عبور فعلی خود را وارد کنید.");
      currentPasswordRef.current?.focus();
      return;
    }

    if (!newPassword) {
      setError("لطفاً رمز عبور جدید را وارد کنید.");
      return;
    }

    if (newPassword.length < 8) {
      setError("رمز عبور جدید باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("رمز عبور جدید باید با رمز فعلی متفاوت باشد.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("تکرار رمز عبور با رمز جدید مطابقت ندارد.");
      return;
    }

    if (typeof onSave !== "function") {
      setError("امکان ثبت تغییرات وجود ندارد.");
      return;
    }

    try {
      setError("");
      setIsSaving(true);
      await ModifyPassword(currentPassword , newPassword)
    } catch (err) {
      setError(
        err?.message || "تغییر رمز عبور انجام نشد. دوباره تلاش کنید."
      );
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const passwordFields = [
    {
      id: "current-password",
      label: "رمز عبور فعلی",
      value: currentPassword,
      setValue: setCurrentPassword,
      placeholder: "رمز عبور فعلی خود را وارد کنید",
      ref: currentPasswordRef,
      autoComplete: "current-password",
    },
    {
      id: "new-password",
      label: "رمز عبور جدید",
      value: newPassword,
      setValue: setNewPassword,
      placeholder: "حداقل ۸ کاراکتر",
      autoComplete: "new-password",
    },
    {
      id: "confirm-password",
      label: "تکرار رمز عبور جدید",
      value: confirmPassword,
      setValue: setConfirmPassword,
      placeholder: "رمز عبور جدید را دوباره وارد کنید",
      autoComplete: "new-password",
    },
  ];

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
      aria-labelledby="change-password-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="بستن"
        onClick={() => !isSaving && onClose()}
        disabled={isSaving}
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
                  x="5"
                  y="10"
                  width="14"
                  height="11"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="15"
                  r="1.2"
                  fill="currentColor"
                />
                <path
                  d="M12 16.2v1.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2
              id="change-password-title"
              className="
                mt-4 text-lg font-semibold
                text-slate-800
                dark:text-slate-100
              "
            >
              تغییر رمز عبور
            </h2>

            <p
              className="
                mt-1.5 max-w-[300px]
                text-sm leading-6
                text-slate-400 dark:text-slate-500
              "
            >
              برای حفظ امنیت حساب خود، رمز عبور جدیدی انتخاب کنید.
            </p>
          </div>

          {/* Password fields */}
          <div className="mt-8 space-y-5">
            {passwordFields.map((field, index) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="
                    mb-2 block
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    ref={field.ref}
                    id={field.id}
                    type={showPasswords ? "text" : "password"}
                    value={field.value}
                    onChange={(event) => {
                      field.setValue(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    disabled={isSaving}
                    className="
                      h-13 w-full
                      rounded-2xl
                      border border-slate-200
                      bg-white/70
                      px-4 pl-12
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

                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    aria-label={
                      showPasswords
                        ? "مخفی کردن رمزهای عبور"
                        : "نمایش رمزهای عبور"
                    }
                    className="
                      absolute left-3 top-1/2
                      flex h-8 w-8 -translate-y-1/2
                      items-center justify-center
                      rounded-lg
                      text-slate-400
                      transition-colors
                      hover:bg-slate-100 hover:text-slate-600
                      dark:hover:bg-white/10
                      dark:hover:text-slate-200
                    "
                  >
                    {showPasswords ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9 7-.2 1-1 2.2-2.1 3.3M6.2 6.3C3.9 7.8 2.3 10.2 2 12c.5 2.5 4 7 10 7 1.2 0 2.3-.2 3.3-.6"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {index === 1 && (
                  <p className="
                    mt-2 text-xs leading-5
                    text-slate-400 dark:text-slate-500
                  ">
                    از ترکیب حروف، اعداد و نمادها استفاده کنید.
                  </p>
                )}
              </div>
            ))}
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

          {/* Security tip */}
          <div
            className="
              mt-5 flex items-start gap-3
              rounded-2xl
              border border-brand-100/70
              bg-brand-50/60
              px-4 py-3.5
              dark:border-brand-500/10
              dark:bg-brand-500/5
            "
          >
            <div
              className="
                mt-0.5 flex h-7 w-7 shrink-0
                items-center justify-center
                rounded-lg bg-white/80
                text-brand-600
                dark:bg-white/5 dark:text-brand-400
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M12 10.5v5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7.5"
                  r=".8"
                  fill="currentColor"
                />
              </svg>
            </div>

            <p className="
              text-xs leading-6
              text-slate-500 dark:text-slate-400
            ">
              رمز عبور خود را با دیگران به اشتراک نگذارید و از
              رمزهای تکراری برای حساب‌های مختلف استفاده نکنید.
            </p>
          </div>

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
                rounded-2xl
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

              {isSaving ? "در حال ذخیره..." : "تغییر رمز عبور"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;