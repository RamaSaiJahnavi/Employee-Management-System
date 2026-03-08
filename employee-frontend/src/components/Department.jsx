import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";

function Department() {

    const API = apiUrl("/departments");

    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({ id: null, name: "", location: "" });
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchDepartments();
    }, []);

    // ---------- Fetch All Departments ----------
    const fetchDepartments = async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            setDepartments(data);
        } catch (err) {
            alert("Failed to fetch departments: " + err.message);
        }
    };

    // ---------- Search ----------
    const searchDepartments = async () => {
        try {
            if (!search) {
                fetchDepartments();
                return;
            }

            // if number → search by ID
            if (!isNaN(search)) {
                const res = await fetch(`${API}/${search}`);
                if (!res.ok) throw new Error("Department not found");
                const data = await res.json();
                setDepartments([data]); // wrap in array
            }
            // otherwise search by name
            else {
                const res = await fetch(`${API}/search/${search}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setDepartments(data);
            }
        } catch (err) {
            setDepartments([]);
            alert(err.message);
        }
    };

    // ---------- Submit Form ----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;
            if (form.id) {
                res = await fetch(`${API}/${form.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            } else {
                res = await fetch(API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Operation failed");
            }

            const message = form.id ? "Department updated successfully" : "Department added successfully";
            alert(message);

            setForm({ id: null, name: "", location: "" });
            fetchDepartments();

        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Edit ----------
    const handleEdit = (dept) => {
        setForm(dept);
    };

    // ---------- Delete ----------
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;

        try {
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Delete failed");
            }
            alert("Department deleted successfully");
            fetchDepartments();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">

            <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                Departments
            </h2>

            {/* 🔎 Search Bar */}
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <input
                    placeholder="Search by ID or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-green-400 sm:w-80"
                />

                <button
                    onClick={searchDepartments}
                    className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                >
                    Search
                </button>

                <button
                    onClick={() => {
                        setSearch("");
                        fetchDepartments();
                    }}
                    className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                >
                    Reset
                </button>
            </div>

            {/* 📝 Form */}
            <form
                onSubmit={handleSubmit}
                className="mb-8 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:p-6 md:flex-row md:items-center"
            >
                <input
                    className="w-full flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="w-full flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />

                <button
                    type="submit"
                    className="w-full rounded-md bg-green-700 px-4 py-2 text-white transition-colors hover:bg-green-800 md:w-auto"
                >
                    {form.id ? "Update" : "Add"}
                </button>
            </form>

            {/* 📋 Departments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((d) => (
                    <div
                        key={d.id}
                        className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {d.name}
                            </h3>

                            <p className="text-gray-600 mb-2">
                                Location: {d.location}
                            </p>

                            <p className="text-gray-600 mb-2">
                                <strong>Employees:</strong>{" "}
                                {d.employees && d.employees.length > 0
                                    ? d.employees.map((emp) => emp.name).join(", ")
                                    : "None"}
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <button
                                onClick={() => handleEdit(d)}
                                className="flex-1 rounded bg-yellow-400 py-2 text-white hover:bg-yellow-500"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(d.id)}
                                className="flex-1 rounded bg-red-500 py-2 text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Department;
