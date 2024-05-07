import "./App.scss";
import { Route, Routes } from "react-router-dom";
import AssemblyPage from "./pages/AssemblyPage";
import Header from "./components/Header";
import { Container } from "@mui/material";

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ padding: "0" }}>
        {/* // * маршрути */}
        <Routes>
          <Route path="/" element={<AssemblyPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
