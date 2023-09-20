"use client";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify";

import { useState, useEffect } from "react";
const Index = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState("");
  useEffect(() => {
    const currentDateAndTime = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    };
    const newFormattedDateTime = currentDateAndTime.toLocaleString("en-US", options);
    setFormattedDateTime(newFormattedDateTime.replace(" at", ""));
  }, []);

  const admin = {
    name: "James William",
    first: "James",
    last: "Williams",
    email: "james@email.com",
    phone: "1234567",
    country: "USA",
    city: "New York",
    password: "abcd123",
    address: "333 St Paun, New York , USA",
  };

  const [formData, setFormData] = useState({
    firstName: admin.first,
    lastName: admin.last,
    email: admin.email,
    phone: admin.phone,
    country: admin.country,
    city: admin.city,
    password: admin.password,
    address: admin.address,
  });

  const [isFormEdited, setIsFormEdited] = useState(false);
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsFormEdited(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormEdited) {
      toast.success("Information is up to date!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    admin.first = formData.firstName;
    admin.last = formData.lastName;
    admin.email = formData.email;
    admin.phone = formData.phone;
    admin.country = formData.country;
    admin.city = formData.city;
    admin.password = formData.password;
    admin.address = formData.address;

    setFormData({
      firstName: admin.first,
      lastName: admin.last,
      email: admin.email,
      phone: admin.phone,
      country: admin.country,
      city: admin.city,
      password: admin.password,
      address: admin.address,
    });
  };

  return (
    <div className="w-full bg-[F9F9F9]">
      <Head>
        <title>Account Settings</title>
      </Head>
      <div className="h-full w-full  my-4 overflow-hidden">
        <div className="hidden md:flex md:flex-row flex-col md:justify-between mx-[2rem] bg-[#FFFFFF] rounded-md shadow-md px-4 py-4">
          <div>
            <h1 className="md:text-[24px] text-lg font-[600]">
              Account Settings
            </h1>
          </div>
          <div className=" items-center hidden smd:flex">
            <div className="flex mr-3">
              <p className="text-xs mr-2">Data Refreshed</p>
              <Image
                src="/images/refresh.svg"
                width={15}
                height={15}
                alt="Refresh Icon"
              />
            </div>
            <div className="bg-[#F0F5FB] border rounded-md border-[#0852C12B] px-3 py-3 text-xs font-medium">
              <p>{formattedDateTime}</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex md:flex-row flex-col items-center md:justify-start my-5 md:mx-8 px-4 md:px-0 ">
          <div className=" w-full md:w-80 flex md:flex-col flex-wrap  ">
            <div className="flex flex-col flex-grow  items-center bg-[#FFFFFF] shadow-lg rounded-md px-3 py-5  md:w-[260px]">
              <div className="flex items-center justify-center mt-1">
                <div className="w-30 h-30 rounded-full  overflow-hidden">
                  <Image
                    src="/images/admin.svg"
                    width={100}
                    height={100}
                    alt="Admin Image"
                  />
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-black text-[18px] font-[600]">
                  James Williams
                </p>
              </div>
              <div className="text-center mt-2 w-[90px]">
                <p className="text-white bg-[#FF5924] px-1 py-1 rounded-sm text-[14px] font-[400]">
                  Admin
                </p>
              </div>
              <div className="text-center mt-2">
                <p className="text-[#0852C1] text-[14px] font-[500] mt-2">
                  Last Modified: 2023-07-27
                </p>
              </div>
              <div className="mt-8 w-full">
                <button className="w-full bg-[#0852C1] text-white py-1 rounded-sm text-[16px] font-[500]">
                  Log Out
                </button>
              </div>
            </div>
            <div className="w-full flex flex-grow flex-1 flex-wrap ">
              <div className="bg-[#FFFFFF] flex flex-col  justify-around  shadow-lg md:w-[260px] rounded-lg py-3 px-5 sm:ml-3   md:ml-0 md:my-3 w-full  md:h-auto h-full overflow-hidden">
                <div className="flex items-start my-2 ">
                  <div className="relative w-5 h-5 mr-3">
                    <Image
                      src="/images/email.svg" // Replace with the path to your email icon image
                      layout="fill"
                      objectFit="contain"
                      alt="Email Icon"
                    />
                  </div>
                  <p className="text-[14px] font-[400]">admin@example.com</p>
                </div>
                <div className="flex items-center my-2">
                  <div className=" relative w-5 h-5 mr-3">
                    <Image
                      src="/images/phone.svg" // Replace with the path to your phone icon image
                      layout="fill"
                      objectFit="contain"
                      alt="Phone Icon"
                    />
                  </div>
                  <p className="text-[14px] font-[400]">+1 123-456-7890</p>
                </div>
                <div className="flex items-center my-2">
                  <div className="relative w-5 h-5 mr-3">
                    <Image
                      src="/images/address.svg" // Replace with the path to your location icon image
                      layout="fill"
                      objectFit="contain"
                      alt="Location Icon"
                    />
                  </div>
                  <p className="text-[14px] font-[400]">
                    123 Main Street, City, Country
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:flex-row flex flex-col   my-5 md:my-0 mx-4 md:mx-6 lg:mx-10 gap-4">
            <div className="w-full  bg-[#FFFFFF] shadow-lg rounded-md px-6 py-5">
              <h2 className="font-semibold text-[18px]">{admin.name}</h2>
              <form className="my-3" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    >
                      <option value="">Select Country</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      {/* Add more country options as needed */}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    >
                      <option value="">Select City</option>
                      <option value="New York">New York</option>
                      {/* Add more city options as needed */}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 bg-[#0852C1] text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-700"
                >
                  Update Information
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Index;
