import { getCurrentStaffContext } from "@/lib/auth/session";
import { requirePermission } from "@/lib/permissions/checks";
import {
  catalogEffectiveDate,
  formatTreatmentPrice,
  treatmentCategories,
  treatments,
} from "@/lib/services/catalog";

export default async function ServicesPage() {
  const staff = await getCurrentStaffContext();
  requirePermission(staff, "services.view");

  return (
    <main className="p-4 sm:p-6">
      <section className="border-b border-[#D9DDE3] pb-5">
        <p className="text-xs font-semibold uppercase text-[#6F263D]">
          Catalog effective {catalogEffectiveDate}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#481827]">Treatments and Services</h1>
        <p className="mt-2 text-sm text-[#5F6368]">
          Management-approved regular prices. Publishing and branch changes remain
          permission-controlled.
        </p>
      </section>
      <div className="mt-6 space-y-7">
        {treatmentCategories.map((category) => (
          <section key={category}>
            <h2 className="mb-3 text-xl font-semibold text-[#481827]">{category}</h2>
            <div className="overflow-hidden rounded border border-[#D9DDE3] bg-white">
              {treatments
                .filter((item) => item.category === category)
                .map((item) => (
                  <article
                    key={item.slug}
                    className="grid gap-2 border-b border-[#E8EAED] p-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-[#262626]">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#5F6368]">
                        {item.doctorRequired ? "Doctor required" : "Aesthetic professional"} ·{" "}
                        {item.summary}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#6F263D]">{formatTreatmentPrice(item)}</p>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
