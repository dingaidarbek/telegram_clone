import { Outlet, NavLink } from 'react-router-dom'

function Layout() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/5 bg-white shadow-lg">
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Navigation</h2>
                    <nav className="space-y-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            Contact
                        </NavLink>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout 