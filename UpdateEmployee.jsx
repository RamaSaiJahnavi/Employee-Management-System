import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function UpdateEmployee() {

    const { id } = useParams()
    const nav = useNavigate()

    const [emp, setEmp] = useState({
        name:"",
        department:"",
        salary:""
    })

    useEffect(() => {
        fetch(`http://localhost:8080/employees/${id}`)
            .then(res=>res.json())
            .then(setEmp)
    },[id])

    const change=e=>{
        setEmp({...emp,[e.target.name]:e.target.value})
    }

    const submit=e=>{
        e.preventDefault()

        fetch(`http://localhost:8080/employees/${id}`,{
            method:"PUT",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify(emp)
        }).then(()=>nav("/"))
    }

    return(
        <div className="container">
            <h3>Update Employee</h3>

            <form onSubmit={submit}>
                <input name="name" value={emp.name} onChange={change}/>
                <input name="department" value={emp.department} onChange={change}/>
                <input name="salary" value={emp.salary} onChange={change}/>
                <button>Update</button>
            </form>
        </div>
    )
}