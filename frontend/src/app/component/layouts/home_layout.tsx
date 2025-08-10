"use client"

import dynamic from "next/dynamic"
import React, { useEffect } from "react"
const Navbar = dynamic(() => import("../navbar"))
const Footer = dynamic(() => import("../footer"))



type Props = {
  children: React.ReactNode
  isLandingPage?: boolean
}

const HomeLayout = ({ isLandingPage = true, children }: Props) => {

  useEffect(() => {
    // Your logic here, if needed
  }, [])

  return (
    <div className="flex flex-col min-h-screen text-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar isLandingPage={isLandingPage} />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomeLayout
