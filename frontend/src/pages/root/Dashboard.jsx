import { useEffect, useState } from "react";

import "./dashboard.css";

import StatsCard from "../../components/root/StatsCard";
import QuickActions from "../../components/root/QuickActions";
import FamilyInfo from "../../components/root/FamilyInfo";
import RecentActivity from "../../components/root/RecentActivity";

import { getDashboard } from "../../api/dashboardApi";


export default function Dashboard(){


const [dashboard,setDashboard] = useState(null);



useEffect(()=>{


getDashboard()

.then(response=>{

console.log(
"DASHBOARD DATA:",
response
);


setDashboard(response.data);


})

.catch(error=>{

console.log(
"Dashboard Error:",
error
);


});


},[]);




if(!dashboard){

return (

<div className="root-dashboard">

<h2>
Loading dashboard...
</h2>

</div>

);

}





return (

<div className="root-dashboard">



<h1>
🌳 Root Admin Dashboard
</h1>



<p className="welcome">

Manage your family tree, members and permissions.

</p>





{/* ================= STATS ================= */}


<div className="stats-container">


<StatsCard

title="Total Members"

value={dashboard.total_members}

icon="👨‍👩‍👧"

/>



<StatsCard

title="Sub Root Admins"

value={dashboard.sub_root_admins}

icon="🔑"

/>



<StatsCard

title="Pending Requests"

value={dashboard.pending_requests}

icon="📩"

/>



<StatsCard

title="Approved Requests"

value={dashboard.approved_requests}

icon="✅"

/>



</div>





{/* ================= FAMILY INFORMATION ================= */}


<FamilyInfo/>





{/* ================= QUICK ACTIONS ================= */}


<QuickActions/>





{/* ================= RECENT ACTIVITY ================= */}


<RecentActivity/>







{/* ================= MAIN ACTION CARDS ================= */}


<div className="dashboard-cards">



<div className="card">


<h3>
👨‍👩‍👧 Members
</h3>


<p>
View, edit and manage all family members.
</p>


<button>
Manage Members
</button>


</div>






<div className="card">


<h3>
🌳 Family Tree
</h3>


<p>
Explore ancestors, descendants and genealogy.
</p>


<button>
Open Tree
</button>


</div>






<div className="card">


<h3>
🔑 Permissions
</h3>


<p>
Give children permission to become Sub Root Admin.
</p>


<button>
Manage Permissions
</button>


</div>






<div className="card">


<h3>
📩 Family Requests
</h3>


<p>
Review and approve family joining requests.
</p>


<button>
View Requests
</button>


</div>





</div>






</div>


);


}