import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import favicon from "../../assets/favicon.png";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "icon", type: "image/png", href: favicon },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap",
      },
    ],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GrownupsVet | Cuidado veterinario" },
      { name: "theme-color", content: "#f5f7f5" },
      {
        name: "description",
        content:
          "Gestiona el cuidado y las citas veterinarias de tus mascotas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CO" },
      { property: "og:site_name", content: "GrownupsVet" },
      { property: "og:title", content: "GrownupsVet" },
      {
        property: "og:description",
        content: "Cuidado veterinario sencillo y accesible para tu familia.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "GrownupsVet" },
      {
        name: "twitter:description",
        content: "Cuidado veterinario sencillo y accesible para tu familia.",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
