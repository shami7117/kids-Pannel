import Image from "next/image";
import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';


const routes = [
  {
    path: "/",
    icon: <Image src="/images/order.svg" alt="orders-icon" width={24} height={24} />,
    title: "Orders",
    roles: ["admin", "user"],
  },
  {
    path: "/products",
    icon: <Image src="/images/products.svg" alt="products" width={24} height={24} />,
    title: "Products",
    roles: ["user", "admin"],
  },
  {
    path: "/buyers",
    icon: <Image src="/images/buyer.svg" alt="buyers" width={24} height={24} />,
    title: "Buyers",
    roles: ["user", "admin"],
  },
  {
    path: "/sellers",
    icon: <Image src="/images/sellers.svg" alt="sellers" width={24} height={24} />,
    title: "Sellers",
    roles: ["user", "admin"],
  },
  {
    path: "/earning",
    icon: <Image src="/images/earnings.svg" alt="earning" width={24} height={24} />,
    title: "Earning",
    roles: ["user", "admin"],
  },
  {
    path: "/messages",
    icon: <Image src="/images/message.png" alt="message" width={24} height={24} />,
    title: "Messages",
    roles: ["user", "admin"],
  },
  {
    path: "/commission",
    icon: <Image src="/images/earnings.svg" alt="commission" width={24} height={24} />,
    title: "Commission",
    roles: ["user", "admin"],
  },
  {
    path: "/profile",
    icon: <Image src="/images/user.svg" alt="profile" width={24} height={24} />,
    title: "Profile",
    roles: ["user", "admin"],
  },

];

export default routes;
