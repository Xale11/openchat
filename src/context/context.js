import React, {useContext, createContext, useState} from 'react'

const ContextAPI = createContext()

const Context = ({children}) => {
    const [roomId, setRoomId] = useState("")
    const [roomName, setRoomName] = useState("")
    const [username, setUsername] = useState()

  return (
    <ContextAPI.Provider value={{roomId, setRoomId, roomName, setRoomName, username, setUsername}}>
        {children}
    </ContextAPI.Provider>
  )
}

export const useStateContext = () => useContext(ContextAPI)

export default Context