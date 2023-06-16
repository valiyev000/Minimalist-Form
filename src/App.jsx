import { useEffect, useState } from 'react'
import './App.scss'
import axios from 'axios'
import delIcon from './assets/delete-icon.svg'

function App() {

  const [mainData, setMainData] = useState([])

  const [updateStatus, setUpdateStatus] = useState(false)


  window.addEventListener("blur",()=>{
    document.title="Where u have gone? Come on..."
  })

  window.addEventListener("focus",()=>{
    document.title="Oh well... U r back))"

    setTimeout(() => {
      document.title="Simple Form"
    }, 2000);
  })


  useEffect(() => {
    axios.get(`http://localhost:3000/surveys`).then((res) => {
      setMainData(res.data.reverse())
    })
  }, [updateStatus])








  // TODO Entry'deki melummatlar burda yigilir inputlardan
  const [newSurvey, setNewSurvey] = useState({ name: "", surname: "", id: "" })


  function forSubmit(e) {
    e.preventDefault()
    axios.post(`http://localhost:3000/surveys`, {
      name: newSurvey.name,
      surname: newSurvey.surname,
      id: newSurvey.id
    }).then((res) => setUpdateStatus((prev) => !prev))

    setNewSurvey({ name: "", surname: "", id: "" })
  }


  function deleteSurvey(id) {
    axios.delete(`http://localhost:3000/surveys/${id}`).then((res)=>setUpdateStatus((prev) => !prev))
  }


  function toCopy(name,surname) {
    navigator.clipboard.writeText(`${name} ${surname}`)
  }

  const [clickedSurveyId, setClickedSurveyId] = useState()

  function copyTextChanger(id) {
    setClickedSurveyId(id)
  }



  return (
    <>
      <section className='loginSection'>
        <form className="loginSectionInner" onSubmit={forSubmit}>
          <h3>New Entry</h3>
          <div className="inputBox">
            <label htmlFor="nameInput" className='label'>Name:</label>
            <input
              type="text"
              name="nameInput"
              id="nameInput"
              className='input'
              value={newSurvey.name}
              onChange={(e) => {
                setNewSurvey(
                  {
                    name: e.target.value,
                    surname: newSurvey.surname,
                    id: `${mainData.length}+${e.target.value}`
                  }
                )
              }
              }
            />
          </div>
          <div className="inputBox">
            <label htmlFor="surnameInput" className='label'>Surname:</label>
            <input
              type="text"
              name="surnameInput"
              id="surnameInput"
              className='input'
              value={newSurvey.surname}
              onChange={(e) => {
                setNewSurvey(
                  {
                    name: newSurvey.name,
                    surname: e.target.value,
                    id: `${mainData.length}+${newSurvey.name}`
                  }
                )
              }
              }
            />
          </div>
          <input type="submit" value="Send" disabled={!newSurvey.name || !newSurvey.surname} />
        </form>
      </section>
      <section className='historySection'>
        {mainData.map((e, i) => {
          return (
            <div className="survey" key={e.id} onClick={()=>{copyTextChanger(e.id); toCopy(e.name,e.surname)}}>
              <div className="name">Name: {e.name}</div>
              <div className="surname">Surname: {e.surname}</div>
              <div className="del-icon-div" onClick={(event)=>{ event.stopPropagation(); deleteSurvey(e.id)}}><img src={delIcon} alt="delete-icon" /></div>
              <div className="copied">{e.id === clickedSurveyId ? "Copied" : "Copy"}</div>
            </div>
          )
        })}
      </section>
    </>
  )
}

export default App
