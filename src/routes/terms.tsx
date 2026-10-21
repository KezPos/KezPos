import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal";
import { pageHead } from "@/components/site/config";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("Terms of Service — KezPos", "The terms for using KezPos on Android and Windows, including accounts, data ownership and Kenyan governing law."),
  component: () => <LegalPage kind="terms" />,
});
