import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal";
import { pageHead } from "@/components/site/config";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy Policy — KezPos", "How KezPos collects, stores and protects your shop data, and your rights under the Kenya Data Protection Act, 2019."),
  component: () => <LegalPage kind="privacy" />,
});
