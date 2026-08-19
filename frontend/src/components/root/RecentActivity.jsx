export default function RecentActivity(){


const activities=[

"Family created successfully",

"New member added",

"Permission granted to child",

"New family request received"

];


return (

<div className="card-box">


<h2>
🔔 Recent Activity
</h2>



<ul>

{

activities.map((item,index)=>(

<li key={index}>
{item}
</li>

))

}


</ul>


</div>

);


}