import { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import routes from "@/routes/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { notification } from "antd"
import { auth } from "../../../Firebase/firebase.js"

const { Sider } = Layout;

const Sidebar = ({ role }) => {
  const router = useRouter();
  const [current, setCurrent] = useState(router.pathname);

  useEffect(() => {
    if (router.pathname) {
      if (current !== router.pathname) {
        setCurrent(router.pathname);
      }
    }
  }, [router, current]);
  const logOut = async () => {
    try {
      await auth.signOut();
      notification.open({
        type: "success",
        message: "Signed out!",
        placement: "top",
      });
      router.push('/login');


    } catch (error) {
      // An error happened during sign-out.
      console.error(error);
    }

  }
  return (
    <Sider
      style={{ paddingTop: "1rem", background: "white" }}
      className=" hidden md:block"
    >
      <div className="flex items-center justify-center">
        <Image src={"/images/clubFoot.svg"} width={170} height={60} alt="logo" />
      </div>
      <Menu
        style={{
          marginTop: "2rem",
        }}
        className="sidebar"
        theme="light"
        defaultSelectedKeys={[current]}
        onClick={({ key }) => {
          setCurrent(key);
        }}
        mode="inline"
        items={routes.map((route) => {
          if (route.roles.includes(role)) {
            return {
              key: route.path,
              icon: (
                <Image
                  src={route.icon.props.src}
                  alt={route.icon.props.alt}
                  width={24}
                  height={24}
                  style={{
                    filter: current === route.path ? "brightness(0) invert(1)" : "none",
                  }}
                />
              ),
              label:
                route?.childrens?.length > 0 ? (
                  <button
                    href={route.path}
                    className="font-normal text-base font-poppins text-white"
                  >
                    {route.title}
                  </button>
                ) : (
                  <Link
                    href={route.path}
                    className={`font-normal text-base font-poppins ${current === route.path ? "text-white" : "text-gray-500"
                      }`}
                  >
                    {route.title}
                  </Link>
                ),
              children: route?.childrens?.map((child) => {
                if (child.roles.includes(role)) {
                  return {
                    key: child.path,
                    icon: (
                      <Image
                        src={child.icon.props.src}
                        alt={child.icon.props.alt}
                        width={24}
                        height={24}
                        style={{
                          filter: current === child.path ? "brightness(0) invert(1)" : "none",
                        }}
                      />
                    ),
                    label: (
                      <Link
                        href={child.path}
                        className={`font-normal text-base font-poppins ${current === child.path ? "text-white" : "text-gray-500"
                          }`}
                      >
                        {child.title}
                      </Link>
                    ),
                  };
                }
              }),
            };
          }
        })}
      />
      <Button
        type="text"
        style={{
          position: "absolute",
          bottom: "0",
          left: "40%",
          transform: "translateX(-50%)",

        }}
        className="flex items-center font-[16px] text-[500] font-poppins text-[#A51F6C] mt-auto mb-2"
        icon={
          <Image
            src={"/images/logout.svg"}
            alt="Logout"
            width={16}
            height={16}
          />
        } onClick={logOut}
      >
        Log Out
      </Button>


    </Sider>
  );
};

export default Sidebar;
