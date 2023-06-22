import React, { useEffect, useState } from 'react'
import "./contact.css"
import { CgProfile } from "react-icons/cg"
import { useStateContext } from '../context/context'
import { auth } from '../config/firebase'

const Contact = ({users, id, user, lastMsg, setRoomId, lastUpdate, openMessages}) => {

  const {setRoomName, roomName} = useStateContext()
  const [time, setTime] = useState()

  const findRoomName = () => {
    let data = Object.entries(users).filter((user) => user[1].email != auth.currentUser.email)
    setRoomName(data[0][1].name)
  }

  const joinRoom = () => {
    setRoomId(id)
    setRoomName(user)
  }

  const convertTime = () => {
    let mesTime = lastUpdate.toDate().toLocaleTimeString()
    let curTime = new Date()
    mesTime = mesTime.slice(0,5)
    let daysGone = (Math.round(Date.now() / 1000) - (lastUpdate.seconds)) / 3600 / 24;
    let mesDate = (lastUpdate.toDate().getDate())
    let curDate = (curTime.getDate())
    let sameDate = false
    if (mesDate == curDate){
      sameDate = true
    }
    if (daysGone < 1 && sameDate) {
      setTime(mesTime)
    }
    else if (daysGone < 2) {
      setTime("Yesterday")
    }
    else{
      setTime(lastUpdate.toDate().toLocaleDateString())
    }
    
  }

  useEffect(() => {
    convertTime()
  }, [])

  // console.log(40, time)
  
  return (
    <div className='contactCard' onClick={() => {joinRoom();openMessages()}}>
        <div className="contactImg">
            <CgProfile/>
        </div>
        <div className="contactDets">
            <div className="contactName">{user}</div>
            <div className="contactMessage">{lastMsg}</div>
        </div>
        <div className="messageDets">
            <div className="timestamp">{time}</div>
            <div className="msgCount"><div>1</div></div>
        </div>
    </div>
  )
}

export default Contact