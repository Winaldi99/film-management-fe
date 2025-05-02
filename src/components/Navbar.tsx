import {
  Disclosure
} from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { LogoutOutlined, BellOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Clapperboard } from "lucide-react"; // Ganti dengan ikon Lucide

const navigation = [
  { name: "Film", to: "/film", current: false },
  { name: "Genre", to: "/genre", current: false },
  { name: "Comment", to: "/comment", current: false }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              {/* Logo and brand on the left */}
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Clapperboard className="text-4xl text-red-500" />
                  <span className="text-white font-bold text-xl hidden md:block">BenMovie</span>
                </div>
              </div>

              {/* Navigation in the center */}
              <div className="hidden sm:flex items-center justify-center flex-1 mx-10">
                <div className="flex space-x-8">
                  {navigation.map((item) => (
                    <NavLink
                      to={item.to}
                      key={item.name}
                      className={({ isActive }) => 
                        classNames(
                          isActive
                            ? "text-yellow-300 border-b-2 border-yellow-300"
                            : "text-gray-200 hover:text-yellow-300 hover:border-b-2 hover:border-yellow-300",
                          "px-3 py-2 text-base font-medium transition-all duration-200"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              
              {/* Controls on the right */}
              <div className="flex items-center space-x-6">
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-300 transition-colors duration-200"
                >
                  <span className="sr-only">View notifications</span>
                  <BellOutlined className="text-2xl" />
                </button>

                <button
                  onClick={() => logout()}
                  className="flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  <LogoutOutlined className="mr-2" />
                  Logout
                </button>

                {/* Mobile menu button */}
                <div className="sm:hidden">
                  <Disclosure.Button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <CloseOutlined className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuOutlined className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-3 pb-3 pt-2 bg-gray-800 border-t border-gray-700">
              {navigation.map((item) => (
                <NavLink
                  to={item.to}
                  key={item.name}
                  className={({ isActive }) => 
                    classNames(
                      isActive 
                        ? 'text-yellow-300 bg-gray-700' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-300',
                      'px-3 py-3 rounded-md text-base font-medium border-b border-gray-700 flex items-center'
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