import React from 'react'
import Card from './component/Card/Card'
import { Sidebar, Container, Rightsidebar, Login } from './component'


const App = () => {
  return (
    <>
      <Container className='w-full  bg-black text-amber-50 flex min-h-screen sm:px-10'>
        {/* <Sidebar/>
        <Card />
        <Rightsidebar/> */}

        <Login />
      </Container>

    </>
  )
}

export default App