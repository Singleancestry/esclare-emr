type ProtectedPlaceholderProps = {
  title: string;
  description: string;
};

export function ProtectedPlaceholder({ title, description }: ProtectedPlaceholderProps) {
  return (
    <main className="p-4 sm:p-6">
      <section className="rounded border border-[#D9DDE3] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-[#481827]">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5F6368]">{description}</p>
      </section>
    </main>
  );
}
