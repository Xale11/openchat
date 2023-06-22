import React, {useRef, useEffect, useState} from 'react'
import "./messenger.css"
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai"
import { BiUserPlus } from "react-icons/bi"
import { BsChevronLeft } from "react-icons/bs"
import Contact from './contact'
import AddContact from './addContact'
import { addDoc, getDocs, getDoc, collection, serverTimestamp, setDoc, doc, query, where, onSnapshot, orderBy, updateDoc, or, limit } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebase'
import { useStateContext } from '../context/context'
import Search from './search'

const Messenger = () => {

    const {roomName, setRoomName, username, setUsername} = useStateContext()

    const navigate = useNavigate()
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
    const [showContacts, setShowContact] = useState(false)
    const [message, setMessage] = useState("")
    const [messageList, setMessageList] = useState([])
    const [roomId, setRoomId] = useState("")
    const [roomList, setRoomList] = useState([])
    const [user, setUser] = useState(false)
    const [showAdds, setShowAdds] = useState(false)
    const [inputSearch, setInputSearch] = useState("")
    const [isSearch, setIsSearch] = useState(false)

    const contactList = useRef()
    const chatArea = useRef()
    const backBtn = useRef()
    const roomID = useRef()
    const moreContact = useRef()
    const roomTitle = useRef()
    const input = useRef()

    const messagesRef = collection(db, "rooms", `${roomId ? roomId : roomID.current}`, "messages")
    const roomsRef = collection(db, "rooms")
    const usersRef = collection(db, "users")


    const getMessages = async () => {
        try{ 
            const q = query(collection(db, "rooms", `${roomId ? roomId : roomID.current}`, "messages"), orderBy("timeSent", "desc"))
            const querySnapshot = await getDocs(q)
            let data = []
            querySnapshot.forEach((doc) => {
                data.push(doc.data())
            })
            setMessageList(data)
        } catch (err){
            console.error(err)
        }
        console.log("render")
    }

    const getRooms = async () => {
        try{ 
            const q = await query(roomsRef, or(where(`users.user1.email`, "==", `${auth.currentUser?.email}`), where(`users.user2.email`, "==", `${auth.currentUser?.email}`)), orderBy("lastUpdate", "desc"))
            const rooms = await getDocs(q)
            let data =[]
            rooms.forEach((room) => {
                data.push({...room.data(), id: room.id})
            })
            setRoomList(data)
            // console.log(8, query(collection(db, "room", `${roomID.current}`, "messages")))
        } catch (err){
            console.error(err)
        }
    }

    const getUsername = async () => {
        try{
            if (auth){
                let data = await getDoc(doc(db, "users", auth?.currentUser?.email))
                if (data.exists()){
                    setUsername(data.data().user)
                }
                else{
                    console.log("dont exist")
                }
            }  
        }catch (err){
            console.error(err)
        }
    }

    const openContacts = () => {
        if (window.innerWidth < 1024 && !showContacts){
            chatArea.current.style.display = "none"
            contactList.current.style.display = "flex"
            backBtn.current.style.display = "none"
            return setShowContact(true)
        }
        if (window.innerWidth < 1024 && showContacts){
            chatArea.current.style.display = "flex"
            contactList.current.style.display = "none"
            backBtn.current.style.display = "none"
            backBtn.current.style.display = "flex"
            return setShowContact(false)
        }
    }

    const openMessages = () => {
        if (window.innerWidth < 1024 && !showContacts){
            chatArea.current.style.display = "flex"
            contactList.current.style.display = "none"
            backBtn.current.style.display = "flex"
            return setShowContact(true)
        }
        if (window.innerWidth < 1024 && showContacts){
            chatArea.current.style.display = "flex"
            contactList.current.style.display = "none"
            backBtn.current.style.display = "none"
            backBtn.current.style.display = "flex"
            return setShowContact(false)
        }
    }

    const sendMessage = async () => {
        try{
            if (roomID.current){
                await addDoc(messagesRef, {
                    timeSent: serverTimestamp(),
                    sender: auth.currentUser.email,
                    message: message,
                })
                await updateDoc(doc(db, "rooms", roomId ? roomId : roomID.current), {lastMsg: message})
                setMessage("")
                getMessages()
                
            }else {
                setMessage("")
                alert("You need to create a chatroom with a contact to send messages")
                return
            } ;
        } catch (err){
            console.error(err)
        }
    }

    const enterMessage = async (e) => {
        try{
            if (e.key == "Enter") {
            return sendMessage()
            }
        } catch (err){
            console.error(err)
        }
    }

    const createUser = async () => {
        try{
            let email = auth.currentUser.email
            await setDoc(doc(db, "users", auth.currentUser?.email), {
                user: user,
                email: auth.currentUser.email
            })
            setUsername(user)
            setUser("")
            let id;
            await addDoc(roomsRef, {
                lastMsg: `Alex (Creator) created a room`,
                lastUpdate: serverTimestamp(),
                users: {user1: {"email": "alexdiyan.ad@gmail.com", "name": "Alex (Creator)"}, user2: {"email": auth.currentUser?.email, "name": username}},
              })
            let q = query(roomsRef, where("users.user1.email", "==", "alexdiyan.ad@gmail.com"), where("users.user2.email", "==", auth.currentUser?.email))
            const data = await getDocs(q)
            data.forEach((doc) => {
                id = doc.id
            })
            await addDoc(collection(db, "rooms", id, "messages"), {
                message: "Hello, welcome to this intant messaging application I created. Try it out for yourself and send me a message about what you think of it",
                sender: "alexdiyan.ad@gmail.com",
                timeSent: serverTimestamp()
            })
        }catch (err){
            console.error(err)
        }
    }

    const searchContact = (e) => {
        if (e.key == "Enter"){
            setIsSearch(true)
            setInputSearch("")
            alert(222)
        }
    }

    const sendBack = () => {
        if(!auth.currentUser?.email){
            navigate("/")
        }
    }
    

    useEffect(() => {
        getUsername()
        getMessages()
        getRooms()
        
        const refreshMessages = onSnapshot(messagesRef, async (docs) => {
            await getMessages()
        })
        const refreshRooms = onSnapshot(roomsRef, async (room) => {
            await getRooms()
        })
        const handleWindowResize = () => {
          setWindowSize([window.innerWidth, window.innerHeight]);
          if (window.innerWidth > 1023 && username){
            chatArea.current.style.display = "flex"
            contactList.current.style.display = "flex"
            backBtn.current.style.display = "none"
            }
            if (window.innerWidth < 1023 && username){
                if (!showContacts){
                    chatArea.current.style.display = "flex"
                    contactList.current.style.display = "none"
                    backBtn.current.style.display = "flex"
                    setShowContact(false)
                }
                else{
                    chatArea.current.style.display = "none"
                    contactList.current.style.display = "flex"
                    setShowContact(true)
                }
            }  
        };

        
    
        window.addEventListener('resize', handleWindowResize);
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };

      }, [auth.currentUser, roomID.current, roomId, username]);

      const logout = async () => {
        try{
            await signOut(auth)
            setRoomName("")
            roomID.current = ""
            setUsername("")
            setUser("")
            navigate("/")
        } catch (err){
            console.error(err)
        }
      }

      console.log(7, inputSearch)

      if (!username) {
        return (
            <div className='messenger' onClick={sendBack}>
                <div className="userPage">
                    <div className="utilitybar">
                    <div className="openContact" ref={backBtn} onClick={openContacts}><BsChevronLeft/></div>
                    <div className="logo">Openchat</div>
                    <div className="signout" onClick={logout}>Log out</div>
                </div>
                <div className="setUser">
                    <div className='showUser'>Logged in as: {auth.currentUser?.email}</div>
                    <div className='enterUsername'>
                        <input type="text" placeholder='Input the your username' onChange={(e) => setUser(e.target.value)}/>
                        <div className="enterBtn" onClick={createUser}>Enter</div>
                    </div>
                    <div>This username will be seen by all your contact and will be used to identify you.</div>
                </div>
                </div>
                
            </div>
        )
      }

  return (
    <div className='messenger' >
        <div className="utilitybar">
            <div className="openContact" ref={backBtn} onClick={openContacts}><BsChevronLeft/></div>
            <div className="logo">Openchat</div>
            <div className="signout" onClick={logout}>Log out</div>
        </div>
        <div className='container'>
            <div className="contacts" ref={contactList}>
                <div className="searchbar">
                    <input type="text" placeholder="Search for a contact..." value={inputSearch} ref={input} onKeyUp={(e) => searchContact(e)} onChange={(e) => setInputSearch(e.target.value)} onFocus={() => setShowAdds(true)} />
                    <AiOutlineSearch onClick={() => {
                        setIsSearch(true)
                        setShowAdds(true)
                    }}/>
                </div>
                {false && <Search/>}
                <div className="contactList" >
                    {roomList.map((room, i) => {
                        let data = Object.entries(room.users).filter((user) => {
                            return user[1].email != auth.currentUser.email
                        })
                        if (i == 0){
                            roomID.current = (room.id)
                            roomTitle.current = data[0][1].name
                            // setRoomName(data[0][1].name)
                        }
                        return <Contact openMessages={openMessages} lastUpdate={room.lastUpdate} id={room.id} users={room.users} user={data[0][1].name} lastMsg={room.lastMsg} setRoomId={setRoomId} roomId={roomId}/>
                    })}
                    {showAdds && <AddContact closePopup={setShowAdds} setRoomId={setRoomId} roomId={roomId} setIsSearch={setIsSearch} isSearch={isSearch} inputSearch={inputSearch} setInputSearch={setInputSearch}/>}
                    <div className="addContact" onClick={() => setShowAdds(true)} >
                        <div>Find contacts</div>
                        <BiUserPlus/>
                    </div>
                </div>
            </div>
            <div className="chatarea" ref={chatArea}>
                <div className="contactInfo">
                    {roomName ? roomName : roomTitle.current}

                </div>
                <div className="messageList">
                    {messageList.map((msg) => {
                        return <div className={`msg ${msg.sender == auth.currentUser.email ? "sent" : "received"}`}>{msg.message}</div>
                    })}
                    
                </div>
                <div className="sendMsg">
                    <input type="text" value={message} placeholder='Send a message...' onKeyUp={enterMessage} onChange={(e) => {setMessage(e.target.value)}}/>
                    <div className="sendBtn" onClick={sendMessage}><AiOutlineSend/></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Messenger