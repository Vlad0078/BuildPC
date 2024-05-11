import { Route, Routes } from "react-router-dom";
import AssemblyPage from "./pages/AssemblyPage";
import Header from "./components/Header";
import { Grid } from "@mui/material";
import ComponentListPage from "./pages/ComponentListPage";
import ComponentPage from "./pages/ComponentPage";

function App() {
  return (
    <Grid container flexDirection="column" height="100%" wrap="nowrap">
      <Grid item>
        <Header />
      </Grid>
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        overflow="hidden auto"
        id="main-container"
        sx={{ pt: 2 }}
      >
        <Grid container flexDirection="column" flexGrow={1} maxWidth="lg">
          {/* // * маршрути */}
          <Routes>
            <Route path="/" element={<AssemblyPage />} />
            <Route path="/component_list" element={<ComponentListPage />} />
            <Route path="/component" element={<ComponentPage />} />
          </Routes>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
