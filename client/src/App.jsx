import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import { PrivateRoute, HomePrivateRoute, AdminHomePrivateRoute } from "./components/privateRoute";
import AdminSignIn from "./pages/AdminSignIn";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminPath && <Header />}

      <Routes>
        <Route element={<HomePrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<AdminSignIn />} />
        <Route element={<AdminHomePrivateRoute />}>
          <Route path="/admin/home" element={<AdminHome />} />
        </Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
