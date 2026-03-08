import { useEffect, useState, useRef } from "react";

function Project() {

    const API = "http://localhost:8080/projects";
    const EMP_API = "http://localhost:8080/employees";

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showEmpDropdown, setShowEmpDropdown] = useState(false);
    const [search, setSearch] = useState("");

    const dropdownRef = useRef(null);

    const [form, setForm] = useState({
        id: null,
        title: "",
        deadline: "",
        employees: []
    });

    useEffect(() => {
        fetchProjects();
        fetchEmployees();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowEmpDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ---------- Fetch Projects ----------
    const fetchProjects = async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error(`Failed to fetch projects: ${res.statusText}`);
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Fetch Employees ----------
    const fetchEmployees = async () => {
        try {
            const res = await fetch(EMP_API);
            if (!res.ok) throw new Error(`Failed to fetch employees: ${res.statusText}`);
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Search Projects ----------
    const searchProjects = async () => {
        try {
            if (!search) {
                fetchProjects();
                return;
            }

            if (!isNaN(search)) {
                const res = await fetch(`${API}/${search}`);
                if (!res.ok) throw new Error("Project not found");
                const data = await res.json();
                setProjects([data]);
            } else {
                const res = await fetch(`${API}/search/${search}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            setProjects([]);
            alert(err.message);
        }
    };

    // ---------- Handle Submit ----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            employees: form.employees.map(id => ({ id: Number(id) }))
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

            const message = form.id ? "Project updated successfully" : "Project added successfully";
            alert(message);

            setForm({ id: null, title: "", deadline: "", employees: [] });
            fetchProjects();

        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Handle Edit ----------
    const handleEdit = (p) => {
        setForm({
            ...p,
            employees: p.employees?.map(e => e.id) || []
        });
    };

    // ---------- Handle Delete ----------
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Delete failed");
            }

            alert("Project deleted successfully");
            fetchProjects();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">

            <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
                Project Management
            </h2>

            {/* SEARCH BAR */}
            <div className="mb-6 flex gap-2 justify-center">

                <input
                    placeholder="Search by ID or Title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-80"
                />

                <button
                    onClick={searchProjects}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                    Search
                </button>

                <button
                    onClick={() => { setSearch(""); fetchProjects(); }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Reset
                </button>

            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >

                <input
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Project Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                />

                <input
                    type="date"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                />

                {/* EMPLOYEE DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setShowEmpDropdown(!showEmpDropdown)}
                        className="border border-gray-300 rounded px-3 py-2 cursor-pointer bg-white flex justify-between items-center"
                    >
                        <span>
                            {form.employees.length ? `${form.employees.length} Selected` : "Select Employees"}
                        </span>
                        <span className={`transition-transform ${showEmpDropdown ? "rotate-180" : ""}`}>
                            ▼
                        </span>
                    </div>

                    {showEmpDropdown && (
                        <div className="absolute z-10 bg-white border mt-1 w-full max-h-40 overflow-y-auto rounded shadow">
                            {employees.map(emp => (
                                <label
                                    key={emp.id}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.employees.includes(emp.id)}
                                        onChange={() => {
                                            if (form.employees.includes(emp.id)) {
                                                setForm({ ...form, employees: form.employees.filter(id => id !== emp.id) });
                                            } else {
                                                setForm({ ...form, employees: [...form.employees, emp.id] });
                                            }
                                        }}
                                    />
                                    {emp.name}
                                </label>
                            ))}
                        </div>
                    )}

                </div>

                <button
                    type="submit"
                    className="bg-green-700 text-white px-4 py-2 rounded"
                >
                    {form.id ? "Update" : "Add"}
                </button>

            </form>

            {/* PROJECT LIST */}
            <div className="grid gap-6">
                {projects.map(p => (
                    <div key={p.id} className="bg-white shadow-md rounded-lg p-4">

                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{p.title} (ID: {p.id})</h3>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <p>Deadline: {p.deadline || "Not set"}</p>
                        <p>Employees: {p.employees?.length ? p.employees.map(e => e.name).join(", ") : "None"}</p>
                        <p>Tasks: {p.tasks?.length ? p.tasks.map(t => t.title).join(", ") : "None"}</p>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default Project;