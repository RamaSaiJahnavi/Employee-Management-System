import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Employees() {

    const [employees, setEmployees] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [searchName, setSearchName] = useState("");

    const nav = useNavigate();

    const load = () => {
        fetch("http://localhost:8080/employees")
            .then(res => res.json())
            .then(setEmployees);
    };

    useEffect(load, []);

    const del = (id) => {
        fetch(`http://localhost:8080/employees/${id}`, {
            method: "DELETE"
        }).then(load);
    };

    // 🔎 SEARCH BY ID
    const searchById = () => {
        if (!searchId) return;

        fetch(`http://localhost:8080/employees/${searchId}`)
            .then(res => {
                if (!res.ok) throw new Error("Employee not found");
                return res.json();
            })
            .then(data => setEmployees([data]))
            .catch(err => alert(err.message));
    };

    // 🔎 SEARCH BY NAME
    const searchByName = () => {
        if (!searchName) return;

        fetch(`http://localhost:8080/employees/search/${searchName}`)
            .then(res => {
                if (!res.ok) throw new Error("Employee not found");
                return res.json();
            })
            .then(data => setEmployees(data))
            .catch(err => alert(err.message));
    };

    return (
        <div className="container">

            {/* HEADER */}
            <div className="page-header">
                <h3 className="left-title">View All Employees</h3>

                <button
                    className="add-btn"
                    onClick={() => nav("/add")}
                >
                    ➕ Add Employee
                </button>
            </div>

            {/* 🔎 SEARCH BAR */}
            <div className="search-bar">

                <input
                    placeholder="Search by ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />

                <button onClick={searchById}>
                    Search ID
                </button>

                <input
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />

                <button onClick={searchByName}>
                    Search Name
                </button>

                <button onClick={load}>
                    Reset
                </button>

            </div>

            {/* EMPLOYEE LIST */}
            {employees.map(e => (
                <div key={e.id} className="card">

                    <div>
                        <b>{e.name}</b><br />
                        {e.department} | ₹{e.salary}
                    </div>

                    <div className="actions">

                        <button onClick={() => nav(`/tasks/${e.id}`)}>
                            Tasks
                        </button>

                        <button onClick={() => nav(`/update/${e.id}`)}>
                            Update
                        </button>

                        <button onClick={() => del(e.id)}>
                            Delete
                        </button>

                    </div>

                </div>
            ))}

        </div>
    );
}