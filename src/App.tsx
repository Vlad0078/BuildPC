import { Route, Routes } from "react-router-dom";
import AssemblyPage from "./pages/AssemblyPage";
import Header from "./components/Header";
import { Grid } from "@mui/material";
import ComponentListPage from "./pages/ComponentListPage";
import ComponentPage from "./pages/ComponentPage";

function App() {
  return (
    <Grid container flexDirection="column" minHeight="100%">
      <Grid item>
        <Header />
      </Grid>
      <Grid
        container
        flexDirection="column"
        alignSelf="center"
        flexGrow={1}
        maxWidth="lg"
      >
        {/* // * маршрути */}
        <Routes>
          <Route path="/" element={<AssemblyPage />} />
          <Route path="/component_list" element={<ComponentListPage />} />
          <Route path="/component" element={<ComponentPage />} />
        </Routes>
      </Grid>
    </Grid>
  );
}

export default App;
