import { Disclosure } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { LogoutOutlined, BellOutlined, MenuOutlined, CloseOutlined, BookOutlined } from "@ant-design/icons";

// Navigation data remains the same
const navigation = [
  { name: "Film", to: "/film", current: false },
  { name: "Genre", to: "/genre", current: false },
  { name: "Comment", to: "/comment", current: false },
];

// classNames utility remains the same
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { logout } = useAuth(); // Auth logic remains the same

  return (
    // Changed background, removed shadow, added border
    <Disclosure as="nav" className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Use justify-between to push logo/actions to edges */}
            <div className="relative flex h-16 items-center justify-between">
              
              {/* Mobile menu button (left side) */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <CloseOutlined className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuOutlined className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo section (remains on the left for desktop) */}
              <div className="flex flex-shrink-0 items-center">
                 {/* Make logo a link to home */}
                 <NavLink to="/" className="flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <BookOutlined className="text-2xl text-indigo-600 dark:text-indigo-400" />
                    <span className="ml-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hidden md:block">MyFilms</span> {/* Optional: Add text logo */}
                 </NavLink>
              </div>

              {/* Centered Navigation for Desktop */}
              <div className="hidden sm:absolute sm:inset-y-0 sm:left-0 sm:right-0 sm:flex sm:items-center sm:justify-center">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      to={item.to}
                      key={item.name}
                      className={({ isActive }) => {
                        return classNames(
                          // Different active style: background color instead of border
                          isActive
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-white"
                            : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium" // Added rounded-md
                        );
                      }}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Right-side Actions (Notification, Logout) */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="relative rounded-full p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-offset-gray-900"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellOutlined className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={() => logout()}
                      // Slightly different hover style
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <LogoutOutlined className="mr-1 h-5 w-5" />
                      Logout
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Mobile menu Panel */}
          <Disclosure.Panel className="sm:hidden border-t border-gray-200 dark:border-gray-700">
             {/* Adjusted padding */}
            <div className="space-y-1 px-2 py-3">
              {navigation.map((item) => (
                <NavLink
                  // Use Disclosure.Button for better accessibility within Panel if needed, but NavLink is fine
                  key={item.name}
                  to={item.to}
                  className={({isActive}) =>
                    classNames(
                       // Match desktop active/inactive styling for consistency
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;