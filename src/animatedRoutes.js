import React, { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { notify, successNotify } from './utils/notifications';
import formatCurrency from './utils/formatCurrency';
import Login from './pages/Login';
import Travel from './pages/Travel';
import { useTotal } from './hooks/PriceContext';
import { useUser } from './hooks/UserContext'

export default function MyRoutes() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Login
                notify={(value) => notify(value)}
                successNotify={(value) => successNotify(value)}
            />

        }, {
            path: "/pages",
            element: <Header
            />,
            children: [
                {
                    path: "/pages/roteiros",
                    element: <Travel
                        notify={(value) => notify(value)}
                        successNotify={(value) => successNotify(value)}
                    />
                },

            ]
        }
    ])

    function Header() {
        const { totalData } = useTotal()
        const { userData } = useUser()

        return (
            <>
                <header className="header">
                    <div className='person-icon'></div>
                    <div className='header-location'>
                        {userData && userData.dados && userData.dados.length !== 0 ? userData.dados.map((user) => {
                            return (
                                <>
                                    <p>{user ? user.location : 'Sem local'}</p>
                                    <div className="airplane-icon-2"></div>
                                    <p>{user ? user.destination : 'Sem destino'}</p>
                                </>
                            )
                        }) : ""}

                    </div>
                    <div>
                        <p>{totalData ? formatCurrency(totalData) : 'R$: 0'}</p>
                    </div>
                </header>
                <Outlet />
            </>
        )
    }

    return <RouterProvider router={router} />
}