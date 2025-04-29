import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const BackNav = () => {
  const is_super = JSON.parse(localStorage.getItem("is_super"));
  const profile = localStorage.getItem("profile");
  return (
    <div className="w-full fixed z-20">
      <header className="bg-white drop-shadow-md  ">
        <div className="mx-auto flex h-16 max-w-full  items-center gap-8 px-4 sm:p-6 lg:p-8">
          <div className="flex flex-1 items-center justify-end md:justify-between">
            <button>
              <a href="/home">
                <i className="fa-solid fa-arrow-left"></i>
              </a>
            </button>
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img alt="" src={profile} className="size-8 rounded-full" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Profile
                  </a>
                </MenuItem>
                {is_super == true && (
                  <MenuItem>
                    <a
                      href="/users"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Users
                    </a>
                  </MenuItem>
                )}

                {is_super == true && (
                  <MenuItem>
                    <a
                      href="/role"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Roles
                    </a>
                  </MenuItem>
                )}

                {is_super == true && (
                  <MenuItem>
                    <a
                      href="/employee"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Employee
                    </a>
                  </MenuItem>
                )}

                <MenuItem>
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Logout
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </header>
    </div>
  );
};

export default BackNav;
