import { useEffect,useState } from "react"
import { useParams,useNavigate } from "react-router-dom"

export default function Tasks(){

    const { id }=useParams()
    const nav=useNavigate()

    const [tasks,setTasks]=useState([])
    const [status,setStatus]=useState("")
    const [priority,setPriority]=useState("")

    const load=()=>{
        fetch(`http://localhost:8080/employees/${id}/tasks`)
            .then(res=>res.json())
            .then(setTasks)
    }

    useEffect(load,[id])

    const complete=tid=>{
        fetch(`http://localhost:8080/tasks/${tid}/complete`,{
            method:"PATCH"
        }).then(load)
    }

    const del=tid=>{
        fetch(`http://localhost:8080/tasks/${tid}`,{
            method:"DELETE"
        }).then(load)
    }

    const filtered = tasks.filter(t=>{
        return (
            (status==="" || t.status===status) &&
            (priority==="" || t.priority===priority)
        )
    })

    return(
        <div className="container">

            <h3>Tasks</h3>

            <button onClick={()=>nav(`/addtask/${id}`)}>
                Add Task
            </button>

            <div className="filter-bar">

                <select value={status}
                        onChange={e=>setStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option>PENDING</option>
                    <option>COMPLETED</option>
                </select>

                <select value={priority}
                        onChange={e=>setPriority(e.target.value)}>
                    <option value="">All Priority</option>
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                </select>

            </div>

            {filtered.map(t=>(
                <div key={t.id} className="card">

                    <div>
                        <b>{t.title}</b><br/>
                        {t.description}<br/>

                        <span className={
                            t.status==="COMPLETED"?"completed":"pending"
                        }>
              {t.status}
            </span>
                        {" | "}{t.priority}
                    </div>

                    <div className="actions">

                        <button onClick={()=>nav(`/updatetask/${t.id}`)}>
                            Update
                        </button>

                        <button onClick={()=>complete(t.id)}>
                            Complete
                        </button>

                        <button onClick={()=>del(t.id)}>
                            Delete
                        </button>

                    </div>

                </div>
            ))}

        </div>
    )
}