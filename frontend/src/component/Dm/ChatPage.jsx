import React, { useEffect, useState, useRef } from 'react'
import { Avatar, Container, Input, ProfileSearch } from '../'
import { useDispatch, useSelector } from 'react-redux'
import { accessChat, fetchChat, getCurrentUser, search, setSelectedChat } from '../../features'
import { formatSmartDate } from '../../data/date'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { IoCompassOutline } from 'react-icons/io5'

function ChatPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const dropdownRef = useRef()
    const { register, handleSubmit } = useForm()
    const [searchValue, setSearchValue] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    const { searchResults, success, currentUser } = useSelector((state) => state.user)
    const { chats } = useSelector((state) => state.chat)
    // const chatss = useSelector((state) => state.chat)
    // console.log("chats", chatss)

    useEffect(() => {
        dispatch(getCurrentUser())
        dispatch(fetchChat())
    }, [dispatch])

    const handleSearch = (data) => {
        const trimmed = data?.name.trim()
        setSearchValue(trimmed)
    }

    useEffect(() => {
        const trimmed = searchValue.trim()
        if (!trimmed) {
            setShowDropdown(false)
            return
        }

        setShowDropdown(true)

        const timeout = setTimeout(() => {
            dispatch(search(trimmed))
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchValue, dispatch])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectUser = (_id, userName) => {
        dispatch(accessChat(_id))
        setSearchValue('')
        setShowDropdown(false)
        navigate(`/messages/${_id}/${userName}`)
    }

    return (
        <Container className="border-x border-white/10 col-span-5 w-full sm:w-[85%] lg:w-full min-h-screen relative">
            <div className="flex flex-col p-4">
                <h2 className="font-bold text-2xl mb-4">Messages</h2>

                {/* Search Input */}
                <form onSubmit={handleSubmit(handleSearch)} className="w-full">
                    <Input
                        placeholder="Search Direct Message"
                        className="w-full pl-10 rounded-3xl relative px-4 py-2 border border-white/30 focus:bg-blue-500/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        {...register('name')}
                        onChange={(e) => setSearchValue(e.target.value)}
                    >
                        <div className='w-4 h-4'>
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="w-full h-full text-white"
                                style={{ fill: 'white' }}
                            >
                                <g>
                                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                                </g>
                            </svg>
                        </div>
                    </Input>
                </form>

                {/* Search Results Dropdown */}
                {showDropdown && success && (
                    <div ref={dropdownRef} className='bg-black rounded-2xl mx-0.5 top-14 right-1 px-3 py-3.5'>
                        <div className='rounded-3xl border border-gray-200/15 shadow-xs shadow-white/45 hide-scrollbar px-5 py-2 max-h-80 overflow-y-auto space-y-2'>
                            {searchResults?.data?.length > 0 ? (
                                searchResults.data.map(({ userName, profileImage, bio, fullName, _id }) => (
                                    <div
                                        key={_id}
                                        onClick={() => handleSelectUser(_id, userName)}
                                        className="cursor-pointer"
                                    >
                                        <ProfileSearch
                                            userName={userName}
                                            profileImage={profileImage.url}
                                            bio={bio}
                                            fullName={fullName}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full flex items-center justify-center bg-transparent">
                                    <p className="text-red-500 text-sm rounded-3xl px-4 py-2">
                                        No user exists with this name!!!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="border-b border-white/10 my-4" />

                {/* Chat List */}
                {chats?.data?.map((chat,index) => {
                    const otherUser = chat.users.find(u => u._id.toString() !== currentUser?.data._id.toString())
                                        console.log("othersuer", otherUser)
                    return <Link
                        to={`${chat?._id}/${otherUser?.userName}`}
                        key={`${index}`}
                        onClick={() => dispatch(setSelectedChat(chat))}
                    >
                        <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-lg my-1 transition">
                            <Avatar
                                classname='w-12 sm:w-17 h-10 sm:h-15'
                                profileImage={otherUser?.profileImage?.url}
                            />
                            <div className="flex flex-col w-full">
                                <div className="flex justify-start items-baseline text-sm text-white/80 ">
                                    <span className="font-semibold">{otherUser?.fullName}</span>
                                    <span className="text-sm text-white/60 pl-1">@{otherUser?.userName}</span>
                                    <span className="text-xs text-white/50 pl-2.5">
                                        {formatSmartDate(chat?.createdAt)}
                                    </span>
                                </div>
                                <div className="text-white mt-1 truncate text-sm ">
                                    {chat?.latestMessage?.content || "Say hi 👋"}
                                </div>
                            </div>
                        </div>
                    </Link>
                }
                )}
            </div>
        </Container>
    )
}

export default ChatPage
