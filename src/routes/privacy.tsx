import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal";
import { pageHead } from "@/components/site/config";
import seo from "@/seo.json";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead(seo.privacy.title, seo.privacy.description),
  component: () => <LegalPage kind="privacy" />,
});
