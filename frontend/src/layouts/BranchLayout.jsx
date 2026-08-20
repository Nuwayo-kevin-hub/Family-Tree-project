import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import "./branchLayout.css";

export default function BranchLayout() {
    return (
        <div className="branch-layout">

            <SideBar />

            <div className="branch-main">

                <Navbar />

                <main className="branch-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}