import { useNavigate } from "react-router-dom";


export default function QuickActions(){
    const navigate=useNavigate();

return (

<div className="card-box">


<h2>
⚡ Quick Actions
</h2>


<div className="quick-actions">


<button onClick={()=> navigate("/root/add-member")}>
➕ Add Member
</button>

<button>
🌳 View Tree
</button>


<button>
🔑 Give Permission
</button>


<button>
📩 Review Requests
</button>


</div>


</div>

);

}