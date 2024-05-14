import { Route, Routes } from "react-router-dom";
import AssemblyPage from "./pages/AssemblyPage";
import ComponentListPage from "./pages/ComponentListPage";
import ComponentPage from "./pages/ComponentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AssemblyPage />} />
      <Route path="/component_list" element={<ComponentListPage />} />
      <Route path="/component" element={<ComponentPage />} />
    </Routes>
  );
}

export default App;
