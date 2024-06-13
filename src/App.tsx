import { PaginationProvider } from "./utils/Contexts/PaginationContext";
import { CategoriesProvider } from "./utils/Contexts/CategoriesContext";
import { LoadingProvider } from "./utils/Contexts/LoadingContext";
import { HelmetProvider } from "react-helmet-async";

import { SearchSchema } from "./components/SearchSchema";
import { AppRoutes } from "./utils/AppRoutes";
function App() {
  return (
    <HelmetProvider>
      <SearchSchema />
      <LoadingProvider>
        <PaginationProvider>
          <CategoriesProvider>
            <AppRoutes />
          </CategoriesProvider>
        </PaginationProvider>
      </LoadingProvider>
    </HelmetProvider>
  );
}

export default App;
