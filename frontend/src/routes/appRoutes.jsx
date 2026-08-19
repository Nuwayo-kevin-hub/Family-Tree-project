import {
    Routes,
    Route
} from "react-router-dom";

import BranchLayout from "../layouts/BranchLayout";

import ProtectedRoute from "../auth/ProtectedRoute";


// =====================
// ROOT
// =====================

import RootLayout from "../layouts/RootLayout";
import RootDashboard from "../pages/root/Dashboard";
import FamilyTree from "../pages/root/FamilyTree";
import ManageMembers from "../pages/root/ManageMembers";
import GivePermission from "../pages/root/GivePermission";
import RootAddMember from "../pages/root/RootAddMember";

//Branch


import SubRootDashboard from "../pages/branch/Dashboard";
import SubRootMembers from "../pages/branch/Members";
import SubRootPermissions from "../pages/branch/Permission";
import SubRootFamilyTree from "../pages/branch/BranchTree";
import AddMember from "../pages/branch/AddMember";
import BranchFamilyTree from "../pages/branch/FamilyTree";


// =====================
// PUBLIC
// =====================

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FamilyRequest from "../pages/FamilyRequest";
import FamilyRequests from "../pages/root/FamilyRequests";




export default function AppRoutes(){


return (

<Routes>


{/* ================= PUBLIC ROUTES ================= */}


<Route
path="/"
element={<Home/>}
/>


<Route
path="/login"
element={<Login/>}
/>


<Route
path="/register"
element={<Register/>}
/>


<Route
path="/family-request"
element={<FamilyRequest/>}
/>





{/* ================= ROOT ADMIN ================= */}


<Route

path="/root"

element={

<ProtectedRoute roles={[
"ROOT_ADMIN"
]}>

<RootLayout/>

</ProtectedRoute>

}

>


<Route

path="dashboard"

element={<RootDashboard/>}

/>

<Route
path="tree"
element={<FamilyTree/>}

/>

<Route

path="members"

element={<ManageMembers/>}

/>

<Route
path="permissions"
element={<GivePermission/>}
/>


<Route
path="requests"
element={<FamilyRequests/>}
/>

<Route
path="add-member"
element={<RootAddMember/>}
/>

</Route>



<Route
    path="/subroot"
    element={
        <ProtectedRoute allowedRoles={["SUB_ROOT_ADMIN"]}>
            <BranchLayout />
        </ProtectedRoute>
    }
>
    <Route index element={<SubRootDashboard/>} />

    <Route
        path="members"
        element={<SubRootMembers />}
    />

    <Route
        path="permissions"
        element={<SubRootPermissions />}
    />

    <Route
        path="tree"
        element={<SubRootFamilyTree />}
    />

<Route
path="add-member"
element={<AddMember/>}

/>

<Route
path="familyTree"
element={<BranchFamilyTree/>}

/>



</Route>


{/* ================= FUTURE ROUTES ================= */}



{/*

BRANCH ADMIN

Tuzongeramo nyuma:

<Route path="/branch">

</Route>


*/}





{/*

SUB ROOT ADMIN

Tuzongeramo nyuma:

<Route path="/sub-root">

</Route>


*/}





{/*

MEMBER

Tuzongeramo nyuma:

<Route path="/member">

</Route>


*/}





{/* 404 */}

<Route

path="*"

element={

<h1>
404 | Page Not Found
</h1>

}

/>



</Routes>


);


}