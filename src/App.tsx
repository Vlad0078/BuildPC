import { Route, Routes } from "react-router-dom";
import AssemblyPage from "./pages/AssemblyPage";
import Header from "./components/Header";
import { Grid } from "@mui/material";
import ComponentListPage from "./pages/ComponentListPage";

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
        </Routes>
      </Grid>
    </Grid>
  );
}

export default App;
