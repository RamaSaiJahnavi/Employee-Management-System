import { useEffect, useState } from "react";

function Employee() {

    const API = "http://localhost:8080/employees";
    const DEPT_API = "http://localhost:8080/departments";

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        id: null,
        name: "",
        email: "",
        salary: "",
        department: { id: "" }
    });

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    // ---------- Fetch Employees ----------
    const fetchEmployees = async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            alert("Failed to fetch employees: " + err.message);
        }
    };

    // ---------- Fetch Departments ----------
    const fetchDepartments = async () => {
        try {
            const res = await fetch(DEPT_API);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setDepartments(data);
        } catch (err) {
            alert("Failed to fetch departments: " + err.message);
        }
    };

    // ---------- Search Employees ----------
    const searchEmployees = async () => {
        try {
            if (!search) {
                fetchEmployees();
                return;
            }

            // search by ID
            if (!isNaN(search)) {
                const res = await fetch(`${API}/${search}`);
                if (!res.ok) throw new Error("Employee not found");
                const data = await res.json();
                setEmployees([data]);
            }
            // search by name
            else {
                const res = await fetch(`${API}/search/${search}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setEmployees(data);
            }
        } catch (err) {
            setEmployees([]);
            alert(err.message);
        }
    };

    // ---------- Handle Submit ----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            salary: Number(form.salary),
            department: { id: Number(form.department.id) }
        };

        try {
            let res;
            if (form.id) {
                res = await fetch(`${API}/${form.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Operation failed");
            }

            const message = form.id ? "Employee updated successfully" : "Employee added successfully";
            alert(message);

            setForm({
                id: null,
                name: "",
                email: "",
                salary: "",
                department: { id: "" }
            });

            fetchEmployees();

        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Handle Edit ----------
    const handleEdit = (emp) => {
        setForm({
            ...emp,
            department: { id: emp.department?.id || "" }
        });
    };

    // ---------- Handle Delete ----------
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Delete failed");
            }

            alert("Employee deleted successfully");
            fetchEmployees();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">

            <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
                Employee Management
            </h2>

            {/* SEARCH BAR */}
            <div className="mb-6 flex gap-2 justify-center">
                <input
                    placeholder="Search by ID or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-80 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button
                    onClick={searchEmployees}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                    Search
                </button>
                <button
                    onClick={() => { setSearch(""); fetchEmployees(); }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Reset
                </button>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
            >
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded px-3 py-2"
                />

                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border rounded px-3 py-2"
                />

                <input
                    type="number"
                    placeholder="Salary"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="border rounded px-3 py-2"
                />

                <select
                    value={form.department.id}
                    onChange={(e) => setForm({ ...form, department: { id: e.target.value } })}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>

                <button className="bg-green-700 text-white px-4 py-2 rounded">
                    {form.id ? "Update" : "Add"}
                </button>
            </form>

            {/* EMPLOYEE LIST */}
            <div className="grid gap-6">
                {employees.map(e => (
                    <div key={e.id} className="bg-white shadow-md rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{e.name} (ID: {e.id})</h3>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEdit(e)}
                                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(e.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <p>Email: {e.email}</p>
                        <p>Salary: ${e.salary}</p>
                        <p>Department: {e.department?.name || "None"}</p>
                        <p>
                            Projects: {e.projects?.length
                            ? e.projects.map(p => p.title).join(", ")
                            : "None"}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Employee;