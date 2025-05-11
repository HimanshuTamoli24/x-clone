import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Container, Button, Avatar, EventLoading } from "../"
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessages, getCurrentUser, getUserDetails, sendMessage, accessChat, addMessageRealtime } from '../../features';
import { data, useParams } from 'react-router-dom';
import { formatJoinDate, formatSmartDate } from '../../data/date';
import { useRef } from 'react';
import { IoSendSharp } from "react-icons/io5";

const socket = io('http://localhost:4444', {
    withCredentials: true,
});

const ChatComponent = () => {
    const dispatch = useDispatch()
    const { username } = useParams()
    const { chatId } = useParams()

    const { getUser, currentUser } = useSelector((state) => state.user);
    const { messages, loading, error } = useSelector((state) => state.message);
    const { selectedChat } = useSelector((state) => state.chat);
    // const select = useSelector((state) => state.chat);
    // console.log("Select",select)

    // const selects = useSelector((state) => state.message);
    // console.log("selectsaaaaa++++++", selects)

    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null)
    const textAreaRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);




    useEffect(() => {
        dispatch(getCurrentUser())
        dispatch(accessChat(chatId))
        dispatch(getUserDetails(username))
    }, [dispatch, username, chatId])

    const autoResizeTextarea = () => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    const handleSubmitMessage = () => {
        if (!message.trim()) return;
        socket.emit("register", getUser?.data?._id);  // currentUser._id is the user ID from your database

        dispatch(sendMessage({ chatId, content: message.trim() }))
        socket.emit("send", { sender: currentUser?.data?._id || "12345", reciever: getUser?.data?._id || "12345", message: message || " fuckoff" })

        setMessage("");
    };

    const {
        fullName,
        userName,
        bio,
        profileImage,
        createdAt
    } = getUser?.data || {};

    useEffect(() => {
        if (chatId) {
            dispatch(getAllMessages(chatId));
        }
    }, [dispatch, chatId]);

    useEffect(() => {
        socket.on("receive", (message) => {
            console.log("reciever", message);
            dispatch(addMessageRealtime(message||"fcukoff")); 
        })
    }, [chatId, dispatch, currentUser, getUser]);
    return (
        <Container className="border-x  border-white/10 col-span-5 w-full sm:w-[85%] lg:w-full min-h-min relative ">
            <div className="text-white items-start border-l border-b border-gray-600 bg-black/50 backdrop-blur-md sticky top-0 xl:text-lg font-semibold py-2">
                <span className='px-3.5 font-bold'>{userName}</span>
            </div>

            <div className='flex-col overflow-y-auto scrollbar-thumb-only'>
                <div className=" border-b pb-10 sm:pb-20 border-white/5 w-full  flex justify-center items-center gap-4  py-3   rounded-lg hover:bg-white/10 transition duration-200">
                    <div className="flex flex-col items-center justify-center max-w-xs truncate">
                        <Avatar
                            classname="w-10 h-10 sm:w-14 sm:h-14"
                            profileImage={profileImage?.url || '1.jpeg'}
                        />
                        <div className="text-white text-sm font-semibold truncate">
                            {fullName || 'Full Name'}
                        </div>
                        <div className="text-gray-400 text-xs truncate">@{userName || 'username'}</div>
                        <div className="text-gray-500 text-xs mt-1 line-clamp-2">
                            {bio || 'No bio yet.'}
                        </div>

                        <div className='text-sm'> {formatJoinDate(createdAt)}</div>
                    </div>
                </div>
                <div className='w-full  h-full  max-h-[25rem]   '>
                    <div className="h-full">
                        {loading && <EventLoading />}
                    </div>
                    <div className='h-full '>
                        {messages?.map((msg, index) => {
                            const isSender = msg.sender._id === currentUser?.data?._id;

                            return (
                                <div
                                    key={index}
                                    className={`flex my-2 px-2 ${isSender ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex flex-col max-w-xs ${isSender ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`break-words px-3 py-1.5 rounded-lg ${isSender
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-700 text-white'
                                                }`}
                                        >
                                            <p className='text-sm'>{msg.content}</p>
                                        </div>
                                        <div className={`text-[10px] mt-1 text-gray-400/70  w-full ${isSender ? 'text-right' : 'text-left'}`}>
                                            {formatSmartDate(msg.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />

                    </div>


                </div>

            </div>

            <div className='flex items-center justify-center 
            sm:mx-12 w-fit sm:min-w-2xl  border bg-black  rounded-2xl px-2  ml-5  fixed bottom-1.5' >
                <div className='p-2.5 hover:bg-blue-600/10   rounded-full'>
                    <Button
                        classname="cursor-pointer  "
                        onBtnClick={(e) => fileInputRef.current.click()}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="w-5 sm:w-6 fill-sky-500 r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03"
                        >
                            <g>
                                <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                            </g>
                        </svg>
                    </Button>
                </div>
                <textarea
                    ref={textAreaRef}
                    onInput={autoResizeTextarea}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Start a new message"
                    value={message}
                    className=" resize-none px-3 py-3 border-none overflow-y-scroll focus:outline-none focus:ring-0 x text-white text-lg overflow-hidden flex-grow max-h-44 scrollbar-thumb-only w-full "
                />
                <button className='hover:bg-blue-600/10 p-2.5 rounded-full' onClick={handleSubmitMessage} >
                    <IoSendSharp className='text-blue-500' />
                </button>
            </div>


        </Container>
    );
};

export default ChatComponent;
