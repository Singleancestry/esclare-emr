import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ESCLARE Aesthetic & Wellness Clinic",
    short_name: "ESCLARE",
    description: "Aesthetic, laser, and wellness care in Naga City and Daet.",
    start_url: "/home",
    display: "standalone",
    background_color: "#faf4ec",
    theme_color: "#59141d",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
