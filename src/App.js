import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import { useState, useEffect } from "react";
import Footer from './components/footer';

function App() {

  //use state for setting tasks and showing task form
const [tasks, setTasks] = useState([])
const [showAddTasks, setShowAddTasks] = useState(false)

//useEffect hook
useEffect(() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }  

  getTasks();
}, []);

//Fetch data from Json server
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/tasks');
  const data = await res.json();

  return data;
}

//Fetch a single task from Json server
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`);
  const data = await res.json();

  return data;
}

//Add Task
const addTask = async (task) => {
  // const id = Math.floor(Math.random() * 10000) + 1
  // const newTask = {id, ...task}
  // setTasks([...tasks, newTask])

  const res = await fetch('http://localhost:5000/tasks',{
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  const data = await res.json();
  setTasks([...tasks, data])
}

//Delete task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`,
  {
    method: 'DELETE'
  })

  setTasks(tasks.filter((task) => task.id !== id))
}

//Toggle reminder
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id);
  const updTask ={...taskToToggle, reminder: !taskToToggle.reminder}

  const res = await fetch(
    `http://localhost:5000/tasks/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    }
  )

  const data = await res.json();

  setTasks(tasks.map(
    (task)=>task.id === id?{
      ...task, reminder: data.reminder
    }:task))
}

  return (


    <div className="container">
      <Header onAdd={() => setShowAddTasks(!showAddTasks)} showAdd={showAddTasks} />
     {showAddTasks && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? <Tasks tasks = {tasks} 
      onDelete={deleteTask} onToggle={toggleReminder}/> : "No Tasks to do"} 
      <Footer />
    </div>

  );
}

export default App;
