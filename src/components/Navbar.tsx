import {
  Disclosure
} from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { LogoutOutlined, BellOutlined, MenuOutlined, CloseOutlined, PlaySquareOutlined } from "@ant-design/icons";

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
    <Disclosure as="nav" className="bg-gray-800 shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="sm:hidden">
                <Disclosure.Button className="p-2 text-gray-400 hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <CloseOutlined className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuOutlined className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex items-center">
                <PlaySquareOutlined className="text-3xl text-red-700" />
                <div className="hidden sm:flex sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        to={item.to}
                        key={item.name}
                        className={({ isActive }) => 
                          classNames(
                            isActive
                              ? "text-indigo-300 border-b-2 border-indigo-300"
                              : "text-gray-200 hover:text-indigo-300",
                            "px-3 py-2 text-sm font-medium"
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">View notifications</span>
                  <BellOutlined className="text-xl" />
                </button>

                <button
                  onClick={() => logout()}
                  className="flex items-center px-3 py-1 text-sm font-medium text-gray-200 hover:text-indigo-300"
                >
                  <LogoutOutlined className="mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 bg-gray-700">
              {navigation.map((item) => (
                <NavLink
                  to={item.to}
                  key={item.name}
                  className={({ isActive }) => 
                    classNames(
                      isActive 
                        ? 'text-indigo-300 bg-gray-600' 
                        : 'text-gray-300 hover:bg-gray-600 hover:text-indigo-300',
                      'block px-3 py-2 rounded-md text-base font-medium'
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