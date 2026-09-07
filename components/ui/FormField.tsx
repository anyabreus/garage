export default function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label?: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
