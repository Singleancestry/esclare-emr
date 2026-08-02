import Script from "next/script";

export function JsonLd({ schema }: { schema: unknown }) {
  const json = JSON.stringify(schema).replaceAll("<", "\\u003c");
  let hash = 0;
  for (let index = 0; index < json.length; index += 1) {
    hash = (hash * 31 + json.charCodeAt(index)) | 0;
  }

  return (
    <Script
      id={`json-ld-${Math.abs(hash)}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
