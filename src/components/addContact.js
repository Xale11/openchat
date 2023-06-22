import React, { useEffect, useState } from 'react'
import "./addContact.css"
import {auth, db} from "../config/firebase"
import { getDocs, collection, where, setDoc, addDoc, query, doc, serverTimestamp, or } from 'firebase/firestore'
import {BsPersonPlusFill} from "react-icons/bs"
import { useStateContext } from '../context/context'
import { useNavigate } from 'react-router-dom'


const AddContact = ({closePopup, setRoomId, roomId, setIsSearch, isSearch, setInputSearch, inputSearch}) => {

  const navigate = useNavigate()

  const roomsRef = collection(db, "rooms")
  const usersRef = collection(db, "users")
  const messagesRef = collection(db, "messages")

  const [contacts, setContacts] = useState()
  const [empty, setEmpty] = useState(false)

  const getContacts = async () => {
    try{
      let q
      if (inputSearch){
        q = query(usersRef, or(where("user", "==", inputSearch), where("email", "==", inputSearch)))
      }
      else{
        q = query(usersRef)
      }
      setIsSearch(false)
      let contacts = await getDocs(q)
      let list = []
      contacts.forEach((contact) => {
        list.push({
          ...contact.data(),
        })
      })
      if(list.length == 0){
        setEmpty(true)
      }
      else{
        setEmpty(false)
      }
      console.log(list.length)
      setContacts([...list])
    }catch (err){
      console.error(err)
    }
    
  }

  useEffect(() => {
    getContacts()
  }, [isSearch])

  // console.log(username)

  return (
    <div className='addContacts' onClick={() => {closePopup(false); setInputSearch("")}}>
        <div className="close">Close</div>
        {empty && <div className='emptyCard'>There are no users with this name or email. Name and emails are case sensitive.</div>}
        {contacts?.map((contact) => {
          if (contact.email == auth.currentUser.email){
            return
          }
          return (
              <ContactCard user={contact.user} email={contact.email} setRoomId={setRoomId} roomId={roomId}/>
          )
        })}
    </div>
  )
}

const ContactCard = ({user, email, setRoomId, roomId}) => {

  const {username} = useStateContext()

  const roomsRef = collection(db, "rooms")

  const createRoom = async () => {
    try{
      let dupe = false
      let check = query(roomsRef, where("users.user1.email", "in",[email, auth.currentUser?.email]), where("users.user2.email", "in", [email, auth.currentUser?.email]))
      check = await getDocs(check)
      check.forEach((doc) => {
        if(doc.exists()){
          alert("You already have an existing chatroom with this contact")
          dupe = true
          return
        }
      })
      if (dupe){
        return
      }
      let idRoom = ""
      await addDoc(roomsRef, {
        lastMsg: `${username} created a room`,
        lastUpdate: serverTimestamp(),
        users: {user1: {"email": email, "name": user}, user2: {"email": auth.currentUser?.email, "name": username}},
      })
      let q = query(roomsRef, where("users.user1.email", "==", email), where("users.user2.email", "==", auth.currentUser?.email))
      let data = await getDocs(q)
      data.forEach((room) => {
        idRoom = room.id
        return setRoomId(room.id)
      })
      await addDoc(collection(db, "rooms", idRoom, "messages"), {
        message: `${username} created a room`,
        sender: auth.currentUser?.email,
        timeSent: serverTimestamp()
      })

    }catch (err){
      console.error(err)
    }
  }

  return (
    <div className="contactSlide">
      <div className="ccDets">
        <div className="ccName">{user}</div>
        <div className="ccEmail">{email}</div>
      </div>
      <div className="ccAdd" onClick={createRoom}>
        <BsPersonPlusFill/>
      </div>
    </div>
  )
}

export default AddContact