import type { MetadataRoute } from "next";
import { BUSINESS_NAME } from "@/lib/clinic/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS_NAME,
    short_name: "ESCLARE",
    description: "Aesthetic, laser, and wellness care in Naga City and Daet.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf4ec",
    theme_color: "#59141d",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
