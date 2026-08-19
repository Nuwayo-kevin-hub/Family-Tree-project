import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import "./layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <NavBar />
      <SideBar />
      <div className="page-content">
        <Outlet /> {/* or {children} */}
      </div>
    </div>
  );
}