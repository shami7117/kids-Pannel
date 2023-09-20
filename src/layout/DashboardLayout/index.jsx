import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image"
import {
    Avatar,
    Button,
    Dropdown,
    Input,
    Layout,
    Spin, notification
} from "antd";
const { Header, Content } = Layout;
import { Menu } from "antd";
import routes from "@/routes/routes";
import { auth } from "../../../Firebase/firebase.js"
import {
    MenuOutlined,
    DashboardOutlined,
    ShoppingCartOutlined,
    AppstoreAddOutlined,
    UnorderedListOutlined,
    HistoryOutlined,
    StarOutlined,
    SettingOutlined,
    DownOutlined
} from "@ant-design/icons";

import { Inter } from "next/font/google";

const font361 = Inter({
    subsets: ["latin"],
    weight: [
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900"
    ]
});


const Index = ({ children }) => {
    const router = useRouter();
    const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");

    const handleMenuClick = (item) => {
        setSelectedMenuItem(item.key);
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        const userId = user?.uid
        if (userId !== undefined) {
            setIsLoggedIn(true)
        }
        else {
            setIsLoggedIn(false)
        }
        console.log("USER", userId);

    })

    const navMenu = (
        <Menu className="custom-dropdown-menu">
            <Menu.Item key="Orders"
                icon={<Image src="/images/order.svg" alt="orders-icon" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/">
                    Orders
                </Link>
            </Menu.Item>
            <Menu.Item key="Products"
                icon={<Image src="/images/products.svg" alt="products" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/products">
                    Products
                </Link>
            </Menu.Item>
            <Menu.Item key="Buyers"
                icon={<Image src="/images/buyer.svg" alt="buyers" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/buyers">
                    Buyers
                </Link>
            </Menu.Item>
            <Menu.Item key="Sellers"
                icon={<Image src="/images/sellers.svg" alt="sellers" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/sellers">
                    Sellers
                </Link>
            </Menu.Item>
            <Menu.Item key="Earning"
                icon={<Image src="/images/earnings.svg" alt="earning" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/earning">
                    Earning
                </Link>
            </Menu.Item>
            <Menu.Item key="Profile"
                icon={<Image src="/images/user.svg" alt="profile" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/profile">
                    Profile
                </Link>
            </Menu.Item>
            <Menu.Item key="Messages"
                icon={<Image src="/images/user.svg" alt="messages" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/messages">
                    Messages
                </Link>
            </Menu.Item>
            <Menu.Item key="Commission"
                icon={<Image src="/images/earnings.svg" alt="commission" width={17} height={17} />}
                onClick={handleMenuClick}>
                <Link href="/commission">
                    Commission
                </Link>
            </Menu.Item>
        </Menu>
    );


    const getPageTitle = (path) => {
        let route = routes.find((r) => r.path === path);
        if (!route) {
            if (path === "/") {
                route = routes.find((r) => r.path === "/")
                return route.title
            }
        }
        return route ? route.title : "";
    }

    const adminImageSrc = "/images/admin.svg";

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
    const items = [
        {
            key: "1",
            label: (
                <span className="text-red-600 opacity-50 text-xs md:text-base font-normal font-poppins"
                    style={
                        { color: "red" }
                    }
                    onClick={() => logOut()}
                >
                    Logout
                </span>
            )
        },
    ];

    return (
        <Layout style={
            { minHeight: "100vh" }

        }>
            <Sidebar role={"admin"} />
            <Layout className="site-layout">
                <Header className="flex items-center justify-between w-full "
                    style={
                        {
                            paddingTop: 20,
                            paddingBottom: 20,
                            height: "4rem",
                            paddingLeft: 4,
                            paddingRight: 0,
                            backgroundColor: "#F9F9F9"
                        }
                    }>


                    <div className="flex items-center justify-between w-full bg-[#FFFFFF] border border-[#C2C2C266]  px-5">
                        <div>
                            <h1 className={
                                `text-[24px] font-[700] font-inter`}
                                style={{ fontSize: "24px !important", fontWeight: "700 !important" }}
                            >
                                {
                                    getPageTitle(router.pathname)
                                }</h1>
                        </div>
                        <div className="flex items-center">
                            <div className="cursor-pointer ">

                                {
                                    isLoggedIn ?
                                        <Dropdown menu={
                                            { items }
                                        }
                                            placement="bottomRight">
                                            <div className="flex items-center">
                                                <div className="mr-2">

                                                    <Avatar size={34} icon={<UserOutlined />} />

                                                </div>
                                                <div className="mt-2">
                                                    <Image src="/images/dropdown.svg" alt="Admin Image"
                                                        width={10}
                                                        height={10}
                                                        className="flex items-center justify-center cursor-pointer rounded-full" />
                                                </div>
                                            </div>

                                        </Dropdown>
                                        : <Link className="font-semibold" href={"/login"} >LogIn</Link>
                                }


                            </div>
                            <div className="md:hidden block " style={{ marginLeft: "1rem" }}>
                                <Dropdown overlay={navMenu}
                                    trigger={
                                        ["click"]
                                    }>
                                    <a className="text-[#0852C1]">
                                        <MenuOutlined style={
                                            { fontSize: "24px", color: "#A51F6C" }
                                        } />
                                    </a>
                                </Dropdown>
                            </div>
                        </div>


                    </div>
                </Header>
                <Content>{children}</Content>
            </Layout>

        </Layout>
    );
};

export default Index;
