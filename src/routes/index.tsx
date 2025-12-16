import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PageComponent,
});

function PageComponent() {
  const { entrypoint } = Route.useRouteContext();

  switch (entrypoint) {
    case "options":
      return <Navigate to="/settings" />;
    default:
      return <Navigate to="/issues" />;
  }
}
