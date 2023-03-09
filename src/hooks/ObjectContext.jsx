import React, { createContext, useContext, useEffect, useState } from 'react'


const ObjectContext = createContext({})

export const ObjectProvider = (props) => {
    const [objectData, setObjectData] = useState([])

    useEffect(() => {
        const loadTotalData = async () => {
            const objectInfo = await localStorage.getItem('meuObjeto')

            if (objectInfo) {
                setObjectData(JSON.parse(objectInfo))
            }
        }
        loadTotalData()
    }, [])

    const updateLocalStorage = async (objectInfo) => {
        await localStorage.setItem("meuObjeto", JSON.stringify(objectInfo));
    }

    const putObjectData = async (objectInfo) => {
        setObjectData(objectInfo)
        await updateLocalStorage(objectInfo)
    }

    const deleteObjects = async (productId) => {
        const newCart = objectData.dados.filter((prd) => prd.id !== productId)
        setObjectData(newCart)
        console.log('NOVO', newCart)
        await localStorage.setItem("meuObjeto", JSON.stringify(newCart));
    }

 

    return (
        <ObjectContext.Provider value={{ putObjectData, deleteObjects, objectData }}>
            {props.children}
        </ObjectContext.Provider>
    )
}

export const useObject = () => {
    const context = useContext(ObjectContext)

    if (!context) {
        throw new Error('useUser bust be used with UserContext')
    }

    return context
}
