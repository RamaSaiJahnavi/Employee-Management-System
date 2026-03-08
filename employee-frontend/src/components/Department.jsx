import { useEffect, useState } from "react";

function Department() {

    const API = "http://localhost:8080/departments";

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
        <div className="container mx-auto p-6">

            <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                Departments
            </h2>

            {/* 🔎 Search Bar */}
            <div className="mb-6 flex gap-2 justify-center">
                <input
                    placeholder="Search by ID or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-80 focus:ring-2 focus:ring-green-400 outline-none"
                />

                <button
                    onClick={searchDepartments}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                    Search
                </button>

                <button
                    onClick={() => {
                        setSearch("");
                        fetchDepartments();
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Reset
                </button>
            </div>

            {/* 📝 Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center"
            >
                <input
                    className="border border-gray-300 rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    className="border border-gray-300 rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />

                <button
                    type="submit"
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
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

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleEdit(d)}
                                className="flex-1 bg-yellow-400 text-white py-1 rounded hover:bg-yellow-500"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(d.id)}
                                className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
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