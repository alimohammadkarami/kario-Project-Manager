import { useEffect, useRef, useState } from "react";

function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
}) {
  const inputRef = useRef(null);

  const [fullName, setFullName] = useState(user?.name || "");
  const [error, setError] = useState("");

  // Sync the field when the modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      setFullName(user?.name || "");
      setError("");
    }
  }, [isOpen, user]);

  // Focus input when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("لطفاً نام و نام خانوادگی را وارد کنید.");
      inputRef.current?.focus();
      return;
    }

    if (trimmedName.length < 3) {
      setError("نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    onSave?.(trimmedName);
  };

  return (
    <div
      dir="rtl"
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        p-4 sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="بستن"
        onClick={onClose}
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
          min-h-[410px]
          flex-col
          overflow-hidden
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
          aria-label="بستن پنجره"
          className="
            absolute left-4 top-4
            flex h-9 w-9 items-center justify-center
            rounded-full
            text-slate-400
            transition-colors
            hover:bg-slate-100
            hover:text-slate-600
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
          className="flex flex-1 flex-col px-6 pb-6 pt-9 sm:px-8"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            {/* Profile icon */}
            <div
              className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl
                bg-brand-50
                text-brand-600

                dark:bg-brand-500/10
                dark:text-brand-400
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M5.5 20a6.5 6.5 0 0 1 13 0"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2
              id="edit-profile-title"
              className="
                mt-4
                text-lg font-semibold
                text-slate-800
                dark:text-slate-100
              "
            >
              ویرایش اطلاعات حساب
            </h2>

            <p className="
              mt-1.5
              max-w-[300px]
              text-sm leading-6
              text-slate-400
              dark:text-slate-500
            ">
              نام و نام خانوادگی خود را به‌روز کنید.
            </p>
          </div>

          {/* Form content */}
          <div className="mt-8">
            <label
              htmlFor="profile-fullname"
              className="
                mb-2 block
                text-sm font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              نام و نام خانوادگی
            </label>

            <input
              ref={inputRef}
              id="profile-fullname"
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              placeholder="مثلاً علی محمد کریمی"
              autoComplete="name"
              className="
                h-13 w-full
                rounded-2xl
                border border-slate-200
                bg-white/70
                px-4
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-300

                transition-all duration-150

                focus:border-brand-400
                focus:ring-4
                focus:ring-brand-500/10

                dark:border-white/10
                dark:bg-white/5
                dark:text-slate-100
                dark:placeholder:text-slate-600
                dark:focus:border-brand-500
                dark:focus:ring-brand-500/10
              "
            />

            {error && (
              <p
                role="alert"
                className="
                  mt-2
                  text-xs
                  text-red-500
                  dark:text-red-400
                "
              >
                {error}
              </p>
            )}
          </div>

          {/* Helpful tip */}
          <div
            className="
              mt-5
              flex items-start gap-3
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
                rounded-lg
                bg-white/80
                text-brand-600
                dark:bg-white/5
                dark:text-brand-400
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
              text-xs
              leading-6
              text-slate-500
              dark:text-slate-400
            ">
              نام شما در بخش‌های مختلف سامانه نمایش داده خواهد شد.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto flex gap-2.5 pt-7">
            <button
              type="button"
              onClick={onClose}
              className="
                h-12 flex-1
                rounded-2xl
                border border-slate-200
                bg-white/60
                px-4
                text-sm font-medium
                text-slate-600
                transition-colors

                hover:bg-slate-50

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
              className="
                h-12 flex-[1.5]
                rounded-2xl
                bg-brand-600
                px-4
                text-sm font-medium
                text-white

                shadow-lg shadow-brand-600/15
                transition-all duration-150

                hover:bg-brand-700
                active:scale-[0.98]

                focus:outline-none
                focus:ring-4
                focus:ring-brand-500/15
              "
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
