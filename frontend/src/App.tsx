import { PaginationProvider } from "./utils/Contexts/PaginationContext";
import { CategoriesProvider } from "./utils/Contexts/CategoriesContext";
import { LoadingProvider } from "./utils/Contexts/LoadingContext";
import { AppRoutes } from "./utils/AppRoutes";
function App() {
  return (
    <LoadingProvider>
      <PaginationProvider>
        <CategoriesProvider>
          <AppRoutes />
        </CategoriesProvider>
      </PaginationProvider>
    </LoadingProvider>
  )
}

export default App
