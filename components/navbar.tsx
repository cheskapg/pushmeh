"use client";

import { onNavigate } from "@/actions/navigation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import NavBarDropdown from "./shared/navbardropdown";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import Link from "next/link";

export const Navbar = ({
  setIsLoading,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const handleTabClick = (url: string, isActive: boolean) => {
    setIsActive(isActive);
    router.replace(url);
  };

  const routes = [
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Due Medications",
      url: "/due-medications",
    },
    {
      label: "Patients List",
      url: "/patient-list",
    },
    {
      label: "Appointments",
      url: "/appointments",
    },
    {
      label: "Chart",
      url: "/chart",
    },
  ];

  const [OpenProfile, setOpenProfile] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  const handleMouseDownOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        console.log("Dropdown is being closed");
        setDropdownOpen(false);
      }
    },
    [dropdownOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDownOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [handleMouseDownOutside]);

  useEffect(() => {
    if (
      pathname === "/due-medications" ||
      pathname === "/patient-list" ||
      pathname === "/chart" ||
      pathname === "/appointments" ||
      pathname === "/dashboard"
    ) {
      setIsLoading(false);
    }
  }, [pathname]);

  const handleMouseEnter = () => {
    setShowGlobalSearch(true);
  };

  // Event handler for when mouse leaves the line
  const handleMouseLeave = () => {
    setShowGlobalSearch(false);
  };
  console.log(dropdownOpen, "dropdownOpen");
  return (
    <div className="fixed bg-[#007C85] w-full h-[70px] flex items-center justify-between px-[145px] z-10 font-medium text-[15px]">
      <Link href="/dashboard" shallow>
        <Image
          src={"/imgs/colina-logo.png"}
          alt={""}
          width={200}
          height={37}
          className="cursor-pointer"
          onClick={(event) => {
            if (pathname === "/dashboard") {
              event.preventDefault();
              setIsLoading(true);
              window.location.reload();
            }
          }}
        />
      </Link>
      <div className="flex gap-[30px] items-center">
        <div className="flex gap-[40px] items-end">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.url}
              className={`cursor-pointer text-white relative `}
              onClick={() => {
                setIsLoading(true);
                if (pathname === route.url) {
                  window.location.reload();
                }
              }}
            >
              <p className="hover:text-gray-200">{route.label}</p>
              {pathname === route.url && !showGlobalSearch && (
                <p
                  className={`${"border-b-[3px] border-[#ffffff] w-full absolute bottom-[-20px]"}`}
                ></p>
              )}
            </Link>
          ))}
        </div>
        <div
          className="flex justify-center items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src="/icons/search-icon-white.svg"
            width={15}
            height={15}
            alt="search"
            className="cursor-pointer absolute"
          />
          {showGlobalSearch && (
            <div
              className={`bg-white flex items-center animate global-search h-[40px] rounded-lg shadow-md transition duration-300`}
            >
              <Image
                src="/icons/search-icon.svg"
                width={15}
                height={15}
                alt="search"
                className="cursor-pointer absolute ml-2"
              />
              <input
                type="text"
                className="w-full h-full rounded-lg ml-7 appearance-none outline-none"
                placeholder="Search..."
              />
            </div>
          )}
        </div>
        <div className="flex gap-3 items-center mr-2">
          <Image
            src={"/imgs/drake.png"}
            alt={""}
            width={30}
            height={30}
            className="rounded-full"
          />
          <Image
            ref={iconRef}
            className={`cursor-pointer select-none ${
              dropdownOpen ? "rotate-180" : ""
            } duration-300 w-auto h-auto`}
            onClick={() => {
              console.log("Toggling dropdownOpen state");
              setDropdownOpen((prevValue) => !prevValue);
            }}
            src={"/svgs/arrow-down.svg"}
            alt={""}
            width={15}
            height={15}
          />
          {dropdownOpen && (
            <NavBarDropdown
              ref={menuRef as React.RefObject<HTMLInputElement>}
              dropDownOpen={dropdownOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};
