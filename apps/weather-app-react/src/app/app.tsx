import { Route, Routes, Link } from 'react-router-dom';
import WeatherPage from "../pages/WeatherPage";
import CreateAccount from "../pages/CreateAccount";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import Cities from "../pages/Cities";
import Settings from "../pages/Settings";

export function App() {
  return (
    <Routes>
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <MainLayout>
          <WeatherPage />
        </MainLayout>
      } />

      <Route path="/cities" element={
        <MainLayout>
          <Cities />
        </MainLayout>
      } />

      <Route path="/settings" element={
        <MainLayout>
          <Settings />
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;
