import "./App.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/dashboard";
import { Header } from "./ui/header";
import { Sidebar } from "./ui/sidebar";

import "formiojs/dist/formio.full.min.css";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex flex-1 md:overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
