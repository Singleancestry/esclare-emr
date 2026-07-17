export default function PublicLoading() {
  return (
    <div
      className="grid min-h-[55vh] place-items-center bg-[#FBF8F2]"
      role="status"
      aria-label="Loading page"
    >
      <div className="text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border border-[#D8C9B4] border-t-[#6F263D]" />
        <p className="mt-4 font-serif text-xl text-[#5B1830]">ESCLARE</p>
      </div>
    </div>
  );
}
