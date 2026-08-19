import { useEffect, useState } from "react";
import "./members.css";
import {
    getMyBranchMembers,
    updateMyBranchMember,
    deleteMyBranchMember
} from "../../api/memberApi";



export default function SubRootMembers() {

    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const loadMembers = async () => {

        try {

            setLoading(true);

            const response =
                await getMyBranchMembers();

            setMembers(
                response?.data ||
                response ||
                []
            );

        } catch (error) {

            console.error(
                "Load branch members:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadMembers();

    }, []);


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this member?"
            );

        if (!confirmed) return;

        try {

            await deleteMyBranchMember(id);

            await loadMembers();

        } catch (error) {

            alert(
                error?.response?.data?.message ||
                "Failed to delete member"
            );

        }

    };


    const filteredMembers =
        members.filter(member => {

            const name = `
                ${member.first_name || ""}
                ${member.middle_name || ""}
                ${member.last_name || ""}
            `.toLowerCase();

            return name.includes(
                search.toLowerCase()
            );

        });


    return (

        <div className="subroot-page">

            <div className="page-header">

                <div>

                    <h1>
                        My Family Members
                    </h1>

                    <p>
                        Members belonging to your branch
                    </p>

                </div>

            </div>


            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search member..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {loading ? (

                <div className="loading">
                    Loading members...
                </div>

            ) : filteredMembers.length === 0 ? (

                <div className="empty-card">
                    No members found.
                </div>

            ) : (

                <div className="table-card">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Gender
                                </th>

                                <th>
                                    Date of Birth
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredMembers.map(member => (

                                <tr key={member.id}>

                                    <td>

                                        <strong>
                                            {member.first_name}{" "}
                                            {member.middle_name || ""}{" "}
                                            {member.last_name || ""}
                                        </strong>

                                    </td>


                                    <td>
                                        {member.gender || "-"}
                                    </td>


                                    <td>
                                        {member.date_of_birth || "-"}
                                    </td>


                                    <td>

                                        <span className="role-pill">
                                            {member.role}
                                        </span>

                                    </td>


                                    <td>

                                        {member.is_alive
                                            ? "Alive"
                                            : "Deceased"}

                                    </td>


                                    <td>

                                        <div className="table-actions">

                                            <button
                                                onClick={() =>
                                                    alert(
                                                        "Edit page will be connected next."
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                className="danger"
                                                onClick={() =>
                                                    handleDelete(
                                                        member.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}