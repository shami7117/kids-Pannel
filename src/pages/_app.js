import DashboardLayout from "@/layout/DashboardLayout";
import GeneralLayout from "@/layout/GeneralLayout";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  if (router.pathname === "/login") {
    return (
      <QueryClientProvider client={queryClient}>
        <GeneralLayout>
          <Component {...pageProps} />
        </GeneralLayout>
        <ReactQueryDevtools initialIsOpen={false} />

      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
      <ReactQueryDevtools initialIsOpen={false} />

    </QueryClientProvider>
  );
}

export default MyApp;