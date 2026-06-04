import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "Bob Fllay 13567 | Deputado Federal | App Oficial" },
      { name: "description", content: "Baixe o App oficial do Bob Fllay. Acompanhe propostas, agenda de comícios e participe da nossa caminhada por um Pará mais forte. Seu voto é 13567!" },
      { name: "author", content: "Equipe Bob Fllay" },
      { name: "keywords", content: "Bob Fllay, 13567, Deputado Federal, Pará, Eleições 2026, Propostas Bob Fllay, Agenda Bob Fllay" },
      
      // Open Graph / Facebook
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bobfllay.app/" },
      { property: "og:title", content: "Bob Fllay 13567 | App Oficial" },
      { property: "og:description", content: "Propostas, agenda e contato direto com seu candidato a Deputado Federal. Vamos juntos!" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b3704804-ff35-4f0c-b522-969a594f46fe/id-preview-063099ac--9a9c9fa0-cf2e-414a-a170-d5e780b9a0e0.lovable.app-1780530562667.png" },

      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: "https://bobfllay.app/" },
      { name: "twitter:title", content: "Bob Fllay 13567 | App Oficial" },
      { name: "twitter:description", content: "Propostas, agenda e contato direto com seu candidato a Deputado Federal. Vamos juntos!" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b3704804-ff35-4f0c-b522-969a594f46fe/id-preview-063099ac--9a9c9fa0-cf2e-414a-a170-d5e780b9a0e0.lovable.app-1780530562667.png" },
      
      // PWA / Theme
      { name: "theme-color", content: "#E91E63" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Bob Fllay" },
    ],
    links: [
      { rel: "canonical", href: "https://bobfllay.app/" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Bob Fllay",
              "jobTitle": "Candidato a Deputado Federal",
              "url": "https://bobfllay.app",
              "image": "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b3704804-ff35-4f0c-b522-969a594f46fe/id-preview-063099ac--9a9c9fa0-cf2e-414a-a170-d5e780b9a0e0.lovable.app-1780530562667.png",
              "sameAs": [
                "https://www.instagram.com/bobfllay",
                "https://www.facebook.com/bobfllay"
              ],
              "description": "Bob Fllay é candidato a Deputado Federal pelo PSD, com foco em trabalho sério e presença real no Pará."
            })
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
