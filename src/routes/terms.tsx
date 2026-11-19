import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal";
import { pageHead } from "@/components/site/config";
import seo from "@/seo.json";

export const Route = createFileRoute("/terms")({
  head: () => pageHead(seo.terms.title, seo.terms.description),
  component: () => <LegalPage kind="terms" />,
});
