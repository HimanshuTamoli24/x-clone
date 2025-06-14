import React, { useEffect, useState, useMemo } from 'react'
import Container from '../Container/Container'
import { Link } from "react-router-dom"
import Avatar from '../Card/Avatar.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from '../../features/index.js'
import X from '../Icon-component/X.jsx'
import SmallLogoutCard from '../Dropdown/SmallLogoutCard.jsx'
import { useLocation } from 'react-router-dom'

function Sidebar() {


    const { error, message, loading, currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const location = useLocation()
    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    const [showComponent, setshowComponent] = useState(false)
    const handleComponent = () => {
        setshowComponent(prev => !prev)
    }

    const memoizedUserData = useMemo(() => currentUser?.data, [currentUser]);

    const SidebarData = [
        {
            icon: <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: 'white' }} className="  r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"><g><path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path></g></svg>,
            title: "Home",
            path: "/home"

        },
        {
            icon: <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: 'white' }} className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>,
            title: "Explore",
            path: "/explore"

        },
        {
            icon: <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: 'white' }} className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path></g></svg>,
            title: "messages",
            path: "/messages"
        },
        // {
        //     icon: <svg viewBox="0 0 33 32" aria-hidden="true" style={{ fill: 'white' }} className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"><g><path d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466"></path></g></svg>
        //     , title: "grok",
        //     path: "/grok"
        // },
        {
            icon: <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: 'white' }} className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g></svg>
            , title: "bookmarks",
            path: "/bookmarks"

        },
        {
            icon: <svg viewBox="0 0 24 24" aria-hidden="true" style={{ fill: 'white' }} className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-lwhw9o r-cnnz9e"><g><path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path></g></svg>
            , title: "Profile"
            , path: memoizedUserData?.userName ? `/${memoizedUserData?.userName}` : "/login"
        },
        
    ]

    return (
        // for test purpose

        <Container className="xl:col-span-2  h-screen   sticky flex justify-center  sm:justify-end xl:justify-center px-3.5 top-0 z-20 ">
            <div className="  py-2 flex flex-col items-center xl:items-start">

                <div className=' w-14 rounded-full px-1 hover:bg-white/5 lg:w-16 text-start py-1'>
                    <Link to="home">
                        <X image="xLight.png" />
                    </Link>
                </div>
                <ul className="flex flex-col gap-2 lg:gap-3 items-start ">
                    {SidebarData.map((item, index) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                to={item.path}
                                key={item.title}
                                className={`flex items-center w-fit sm:gap-4  sm:p-3 p-2 xl:px-4 rounded hover:bg-white/15 hover:rounded-full cursor-pointer 
                ${isActive ? 'bg-white/5 rounded-full' : ''}`}
                            >
                                <span className="w-6 h-6 sm:w-7 sm:h-7">{item.icon}</span>
                                <span className="hidden xl:block text-xl font-medium first-letter:uppercase lowercase">{item.title}</span>
                            </Link>
                        );
                    })}

                </ul>
                <Link
                    to={'/compose/post'}
                    className="bg-white cursor-pointer     my-2.5  border-blue-300/75 border hover:bg-white/75 hover:transition-colors  text-white w-fit font-semibold p-2 text-xl sm:py-3 sm:px-3 xl:px-10 flex items-center justify-center transition duration-200 ease-in-out  rounded-full lg:rounded-4xl"
                >
                    {/* Icon for small screens */}
                    <span className="block xl:hidden" title="Post">
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="w-4 h-4 sm:w-7 sm:h-7 text-black "
                            fill="currentColor"
                        >
                            <g>
                                <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z" />
                            </g>
                        </svg>
                    </span>

                    {/* Text for medium and up */}
                    <span className="hidden text-black font-semibold px-6  xl:inline">Post</span>
                </Link>



                <div onClick={handleComponent} className="flex items-center  relative justify-between gap-12 my-1 p-2 w-fit hover:bg-white/15 hover:rounded-full ">
                    <div className="flex items-center gap-2 ">
                        <Avatar profileImage={memoizedUserData?.profileImage?.url} classname=" border-2  border-gray-900 w-10 h-10 sm:w-12 sm:h-12 object-cover" />

                        <div className='hidden xl:block overflow-hidden max-w-[8rem]'>
                            <h5 className="text-sm font-semibold leading-tigh truncate">{memoizedUserData?.fullName||"fullname"}</h5>
                            <h6 className="text-xs text-gray-500 truncate">@{memoizedUserData?.userName||"username"}</h6>
                        </div>
                    </div>
                    <SmallLogoutCard className={showComponent ? "block " : "hidden"} data={memoizedUserData} />

                </div>
            </div>
        </Container>
    )
}

export default Sidebar
