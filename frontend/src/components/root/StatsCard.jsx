export default function StatsCard({
    title,
    value,
    icon
}){

return (

<div className="stats-card">

    <div className="stats-icon">
        {icon}
    </div>


    <div className="stats-info">

        <h4>
            {title}
        </h4>


        <h2>
            {value}
        </h2>

    </div>


</div>

);

}