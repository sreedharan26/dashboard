import { useEffect, useState } from 'react'
import Card from './components/card'
import axios from 'axios'
import Display from './assets/icons_FEtask/Display.svg'
import down from './assets/icons_FEtask/down.svg'
import add from './assets/icons_FEtask/add.svg'
import dotmenu from './assets/icons_FEtask/3dotmenu.svg'
import profile from './assets/icons_FEtask/profile.svg'
import Todo from './assets/icons_FEtask/To-do.svg'
import Inprogress from './assets/icons_FEtask/in-progress.svg'
import Done from './assets/icons_FEtask/Done.svg'
import Canceled from './assets/icons_FEtask/Cancelled.svg'
import Backlog from './assets/icons_FEtask/Backlog.svg'
import urgent from './assets/icons_FEtask/SVG - Urgent Priority colour.svg'
import urgentGray from './assets/icons_FEtask/SVG - Urgent Priority grey.svg'
import highPriority from './assets/icons_FEtask/Img - High Priority.svg'
import lowPriority from './assets/icons_FEtask/Img - Low Priority.svg'
import mediumPriority from './assets/icons_FEtask/Img - Medium Priority.svg'
import noPriority from './assets/icons_FEtask/No-Priority.svg'


import './App.css'

function App() {

  const [data, setData] = useState([])
  const [users, setUsers] = useState([])
  const [grid, setGrid] = useState([])
  const [option1, setOption1] = useState(localStorage.getItem('option1') || 'state')
  const [option2, setOption2] = useState(localStorage.getItem('option2') || 'priority')
  const [click, setClick] = useState(true)
  
  // console.log(data)
  
  function displayState(data = []) {
    let statusArr = 
    {
      'Backlog' : [], 
      'Todo' : [], 
      'In progress' : [], 
      'Done' : [], 
      'Canceled': []
    }

    if(data.length == 0) {
      return statusArr
    }

    // for (let ticket of data) {
    //   console.log(ticket)
    //   statusArr[ticket?.status]?.push(ticket)
    // }

    data.forEach(ticket => {
      statusArr[ticket?.status]?.push(ticket)
    })
    
    // console.log(statusArr)
    return statusArr;
    
  }
  
  function displayPriority(data = []) {
    const priorityArr = ['No priority', 'Low', 'Medium', 'High', 'Urgent'];
    let arr = 
    {
      'No priority': [],
      'Low' : [],
      'Medium' : [],
      'High' : [],
      'Urgent' : []  
    };

    data.forEach(ticket => {
      arr[priorityArr[ticket.priority]].push(ticket);
    })

    return arr
    
  }

  function displayUsers(data = [], users = []){
    let arr = new Map()
    let names = new Map()
    users.forEach(user => {
      names[user.id] = user.name;
      arr[user.id] = []
    })

    data.forEach(ticket => {
      arr[ticket.userId]?.push(ticket)
    })

    for (let key in arr) {
      if (names[key] != "") {
        arr[names[key]] = arr[key];
        delete(arr[key])
      }
    }
    
    return arr;

  }

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://api.quicksell.co/v1/internal/frontend-assignment");
      console.log(response.data)
      setData(response.data.tickets)
      setUsers(response.data.users)
      const statusArr = displayUsers(response.data.tickets, response.data.users);
      console.log(statusArr)
      setGrid(statusArr)
      console.log(Object.entries(statusArr))
    }
    fetchData();

    
  }, [])

  useEffect(() => {
    if(option1 == 'status'){
      const statusArr = displayState(data)
      setGrid(statusArr)
    }else if(option1 == 'priority'){
      const priorityArr = displayPriority(data)
      setGrid(priorityArr)
    }else {
      const usersArr = displayUsers(data, users)
      setGrid(usersArr)
    }
    localStorage.setItem('option1', option1)
  }, [option1])

  useEffect(() => {
    if(option2 == 'priority'){
      const arr = Object.fromEntries(Object.entries(grid).map(([key, value]) => [key, [...value].sort((a, b) => b.priority - a.priority)]))
      setGrid(arr)
    }else {
      const arr = Object.fromEntries(Object.entries(grid).map(([key, value]) => [key, [...value].sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))]))
      setGrid(arr)
      // console.log(grid)
    }
    localStorage.setItem('option2', option2)
  }, [option2])

  
  return (
    <>
      <div className='header'>
          <button className='selector' onClick={() => setClick(x => !x)}>
              <img
                className='display-img'
                src={Display}
                />
              Display 
              <img 
                className='down-img'
                src={down}
                />
          </button>
          {click && 
            <div className='option-cont'>
              <label className='opt1' htmlFor='option1'>Grouping</label>
              <select value={option1} onChange={(e) => setOption1(e.target.value)} name='option1' id='option1'> 
                <option value='status'>Status</option>
                <option value='priority'>Priority</option>
                <option value='users'>Users</option>
              </select>
              <br></br>
              <br></br>
              <label className='opt2' htmlFor='option2'>Ordering</label>
              <select value={option2} onChange={(e) => setOption2(e.target.value)} name='option2' id='option2'> 
                <option value='priority'>Priority</option>
                <option value='title'>Title</option>
              </select>
            </div>  
          }
      </div>
      <div className='grid-container'>
        {
          Object.entries(grid).map(([key, value], index) => {
            return (
              <>
              <div key={index} className='column'>
                <div className='section1'>
                  <div className="image-cont1">
                    <img src={
                      key == 'No priority' ? noPriority :
                      key == 'Low' ? lowPriority :
                      key == 'Medium' ? mediumPriority :
                      key == 'High' ? highPriority :
                      key == 'Urgent' ? urgent :
                      key == 'Backlog' ? Backlog :
                      key == 'Todo' ? Todo :
                      key == 'In progress' ? Inprogress :
                      key == 'Done' ? Done :
                      key == 'Canceled' ? Canceled :
                      profile
                    } />
                    {option1 == 'user' && <div className={`${users.filter(user => user.name == key)[0]?.available}`}></div>}
                  </div>
                  <p className='key'>{key}</p>
                  <span>{value.length}</span>
                  <img
                    className='add'
                    src={add}  
                    />
                  <img 
                    className='dotmenu'
                    src={dotmenu}
                    />
                </div>  
                <div className='section2'>
                  {value?.map((ticket, i) => {
                    return (
                      <Card 
                        key={i}
                        id={ticket.id}
                        title={ticket.title}
                        tag={ticket.tag}
                        availability={`${users.filter(user => user.id == ticket.userId)[0]?.available}`}
                        dp={profile}
                        icon={
                          parseInt(i%4) === 0 ? noPriority :
                          parseInt(i%4) === 1 ? highPriority :
                          parseInt(i%4) === 2 ? mediumPriority :
                          parseInt(i%4) === 3 ? lowPriority :
                          urgentGray}
                        option={option1}
                        
                      />
                    )
                  })}
                </div>
              </div>
            </>

            )
          })
        }
      </div>
      

    </>
  )
}

export default App
