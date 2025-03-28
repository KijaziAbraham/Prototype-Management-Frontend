import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import SubmitPrototype from "./pages/SubmitPrototype";
import EditPrototype from "./pages/EditPrototype";
import AssignStorage from "./pages/AssignStorage";
import ReviewPrototypes from "./pages/ReviewPrototypes";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("access_token");
  return token ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/submit-prototype" element={<PrivateRoute element={<SubmitPrototype />} />} />
        <Route path="/edit-prototype/:id" element={<PrivateRoute element={<EditPrototype />} />} />
        <Route path="/assign-storage/:id" element={<AssignStorage />} /> {}
        <Route path="/review-prototype/:id" element={<ReviewPrototypes />} />  { }

      </Routes>
    </Router>
  );
}

export default App;
