import React, {useEffect, useState} from 'react'
import "./search.css"
import { db, auth } from '../config/firebase'
import { getDocs, query, collection, or, where } from 'firebase/firestore'
import {BsFillSendPlusFill } from "react-icons/bs"

const Search = () => {

    const roomsRef = collection(db, "rooms")

    const [contactList, setContactList] = useState()

    const listContact = async () => {
        const q = query(roomsRef, or(where(`users.user1.email`, "==", `${auth.currentUser?.email}`), where(`users.user2.email`, "==", `${auth.currentUser?.email}`)))
        let data = await getDocs(q)
        let list = []
        data.forEach((doc) => {
            return list.push({
                ...doc.data().users,
            })
        })
        list = list.map((doc) => {
            if (doc.user1.email == auth.currentUser.email){
                return doc.user2
            }
            else{
                return doc.user1
            }
        })
        setContactList([...list])
    }

    console.log(contactList)

    useEffect(() => {
        listContact()
    }, [])

  return (
    <div className='dropdown'>
        {contactList?.map((contact) => {
            return (
                <div className='ccList'>
                    <div className="ccDets">
                        <div className="ccName">{contact.name}</div>
                        <div className="ccEmail">{contact.email}</div>
                    </div>
                    <div className="ccAdd" >
                        <BsFillSendPlusFill/>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default Search