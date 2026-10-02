import { createFileRoute } from "@tanstack/react-router";
import { PropietarioApp } from "@propietario/PropietarioApp";

export const Route = createFileRoute("/")({
  component: PropietarioApp,
});
