
import React, { createContext, useContext, useEffect, useState } from 'react'


const TotalContext = createContext({})

export const TotalProvider = (props) => {
    const [totalData, setTotalData] = useState()

    const putTotalData = async (totalInfo) => {
        setTotalData(totalInfo)
        await localStorage.setItem('TotalPrice', JSON.stringify(totalInfo))

    }
    useEffect(() => {
        const loadTotalData = async () => {
            const totalInfo = await localStorage.getItem('TotalPrice')

            if (totalInfo) {
                setTotalData(JSON.parse(totalInfo))
            }
        }
        loadTotalData()
    }, [])
    
    return (
        <TotalContext.Provider value={{ putTotalData, totalData }}>
            {props.children}
        </TotalContext.Provider>
    )
}

export const useTotal = () => {
    const context = useContext(TotalContext)

    if (!context) {
        throw new Error('useUser bust be used with UserContext')
    }

    return context
}
