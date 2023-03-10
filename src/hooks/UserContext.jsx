import React, { createContext, useContext, useEffect, useState } from 'react'


const UserContext = createContext({})

export const UserProvider = (props) => {
  const [userData, setUserData] = useState()

  const putUserData = async (userInfo) => {
    setUserData(userInfo)

    await localStorage.setItem('myUser', JSON.stringify(userInfo))

  }

  useEffect(() => {
    const loadUserData = async () => {
      const clientInfo = await localStorage.getItem('myUser')

      if (clientInfo) {
        setUserData(JSON.parse(clientInfo))
      }
    }
    loadUserData()
  }, [])

  return (
    <UserContext.Provider value={{ putUserData, userData }}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser bust be used with UserContext')
  }

  return context
}