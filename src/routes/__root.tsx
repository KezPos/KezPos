import { Outlet, createRootRoute, HeadContent } from "@tanstack/react-router";
import { NotFound } from "@/components/site/not-found";

export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
    </>
  ),
  notFoundComponent: NotFound,
});
