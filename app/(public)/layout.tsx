import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { BranchProvider } from "@/components/public/branch-provider";
import { FloatingMessenger } from "@/components/public/floating-messenger";
import { JsonLd } from "@/components/public/json-ld";
import { organizationSchema } from "@/lib/seo/organization-schema";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <BranchProvider>
      <div className="public-site">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <div id="main-content" tabIndex={-1} className="page-enter">
          {children}
        </div>
        <SiteFooter />
        <FloatingMessenger />
        <JsonLd schema={organizationSchema} />
      </div>
    </BranchProvider>
  );
}
