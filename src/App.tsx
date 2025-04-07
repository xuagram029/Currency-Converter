import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CurrencyConverter from "./components/CurrencyConverter";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CurrencyConverter />
      </QueryClientProvider>
    </>
  );
}

export default App;
