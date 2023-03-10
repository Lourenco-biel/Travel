
import React, { createContext, useContext, useEffect, useState } from 'react'

import { useObject } from '../hooks/ObjectContext';

const TotalContext = createContext({})

export const TotalProvider = (props) => {
    const [totalData, setTotalData] = useState()
    const { objectData } = useObject()

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
        const loadPrice = async () => {
            if (localStorage.getItem("meuObjeto")) {
                let meuObjeto = JSON.parse(localStorage.getItem("meuObjeto"))
                const sumAllItems = await meuObjeto.dados.reduce((acc, current) => {
                    return parseInt(current.cost) + acc
                }, 0)
                putTotalData(sumAllItems)
            }
        }
        loadPrice()
    }, [objectData, totalData])

    return (
        <TotalContext.Provider value={{ putTotalData, totalData, setTotalData }}>
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
