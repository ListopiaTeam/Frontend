import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"
import { UserContext } from '../UserContext'
import { extractUrlAndId } from '../utility/utils'
import { getUser } from '../utility/crudUtility' // Import the function to get user data

const Header = () => {
  const [show, setShow] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false); // New state to hold admin status
  const { user, logoutUser } = useContext(UserContext)
  const navigate = useNavigate()

  const logOut = () => {
    logoutUser()
    navigate("/")
  }

  useEffect(() => {
    if (user?.photoURL) {
      setAvatar(extractUrlAndId(user.photoURL).url)
      !user && setAvatar(null)
    }

    // Fetch admin status from the Users collection
    const fetchAdminStatus = async () => {
      if (user?.uid) {
        const userData = await getUser(user.uid);
        if (userData && userData.isAdmin) {
          setIsAdmin(true); // Set to true if the user is an admin
        } else {
          setIsAdmin(false); // Set to false if the user is not an admin
        }
      }
    }

    fetchAdminStatus();
  }, [user, user?.photoURL]);

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <img 
              src="/Listopia_Icon_v2_big.png" 
              alt="Listopia" 
              className="h-8 w-8 transition-transform hover:scale-105"
            />
            <span className="text-xl font-bold text-rose-500">LISTOPIA</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {user && (
                <>
                  <NavLink 
                    to="/create" 
                    className={({isActive}) => 
                      `block px-3 py-2 rounded-md transition-colors relative ${
                        isActive 
                          ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                          : "text-white hover:text-rose-500"
                      }`
                    }
                  >
                    Create List
                  </NavLink>

                  {/* ✅ Admin Panel - Only for Admins */}
                  {isAdmin && (
                    <NavLink 
                      to="/adminpanel/users" 
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-md transition-colors relative ${
                          isActive 
                            ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                            : "text-white hover:text-rose-500"
                        }`
                      }
                    >
                      Admin Panel
                    </NavLink>
                  )}
                </>
              )}
              <NavLink 
                to="/lists" 
                className={({isActive}) => 
                  `block px-3 py-2 rounded-md transition-colors relative ${
                    isActive 
                      ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                      : "text-white hover:text-rose-500"
                  }`
                }
              >
                Lists
              </NavLink>
            </div>

            {/* Auth Section */}
            <div className="ml-6 flex items-center space-x-6 border-l border-gray-700 pl-6">
              {!user ? (
                <>
                  <NavLink 
                    to="/register" 
                    className="text-white hover:text-rose-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </NavLink>
                  <NavLink 
                    to="/login" 
                    className="bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-700 transition-colors"
                  >
                    Login
                  </NavLink>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink 
                    to="/profile" 
                    className="flex items-center space-x-2 text-white hover:text-rose-500 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                      {avatar ? (
                        <img className='h-8 w-8 rounded-full' src={avatar} alt="Profile picture" />
                      ) : (
                        <span className="text-sm font-medium">
                          {user?.displayName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{user?.displayName}</span>
                  </NavLink>
                  <button 
                    onClick={logOut}
                    className="text-white hover:text-rose-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShow(!show)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-rose-500 focus:outline-none"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {show ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute w-full bg-gray-800/95 backdrop-blur-sm"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              <NavLink 
                to="/" 
                onClick={() => setShow(false)}
                className={({isActive}) => 
                  `block px-3 py-2 rounded-md transition-colors relative ${
                    isActive 
                      ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                      : "text-white hover:text-rose-500"
                  }`
                }
              >
                Home
              </NavLink>

              {user && (
                <>
                  <NavLink 
                    to="/create" 
                    onClick={() => setShow(false)}
                    className={({isActive}) => 
                      `block px-3 py-2 rounded-md transition-colors relative ${
                        isActive 
                          ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                          : "text-white hover:text-rose-500"
                      }`
                    }
                  >
                    Create List
                  </NavLink>

                  {/* ✅ Admin Panel - Only for Admins */}
                  {isAdmin && (
                    <NavLink 
                      to="/adminpanel/users" 
                      onClick={() => setShow(false)}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-md transition-colors relative ${
                          isActive 
                            ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                            : "text-white hover:text-rose-500"
                        }`
                      }
                    >
                      Admin Panel
                    </NavLink>
                  )}
                </>
              )}

              <NavLink 
                to="/lists" 
                onClick={() => setShow(false)}
                className={({isActive}) => 
                  `block px-3 py-2 rounded-md transition-colors relative ${
                    isActive 
                      ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                      : "text-white hover:text-rose-500"
                  }`
                }
              >
                Lists
              </NavLink>

              <div className="border-t border-gray-700 pt-2 mt-2">
                {!user ? (
                  <>
                    <NavLink 
                      to="/register" 
                      onClick={() => setShow(false)}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-md transition-colors relative ${
                          isActive 
                            ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                            : "text-white hover:text-rose-500"
                        }`
                      }
                    >
                      Register
                    </NavLink>
                    <NavLink 
                      to="/login" 
                      onClick={() => setShow(false)}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-md transition-colors relative ${
                          isActive 
                            ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                            : "text-rose-500 hover:text-rose-600"
                        }`
                      }
                    >
                      Login
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to="/profile" 
                      onClick={() => setShow(false)}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-md transition-colors relative ${
                          isActive 
                            ? "text-rose-500 pl-6 before:content-['>'] before:absolute before:left-3" 
                            : "text-white hover:text-rose-500"
                        }`
                      }
                    >
                      Profile
                    </NavLink>
                    <button 
                      onClick={logOut}
                      className="w-full text-left px-3 py-2 text-white hover:text-rose-500 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Header
