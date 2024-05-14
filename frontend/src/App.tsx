import { PaginationProvider } from "./utils/Contexts/PaginationContext";
import { CategoriesProvider } from "./utils/Contexts/CategoriesContext";
import { AppRoutes } from "./utils/AppRoutes";
function App() {
  return (
    <PaginationProvider>
      <CategoriesProvider>
        <AppRoutes />
      </CategoriesProvider>
    </PaginationProvider>
  )
}

export default App
