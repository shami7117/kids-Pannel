"use client";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify";
import { Input, message } from "antd";
import AdminApi from "@/lib/admin.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { auth, db } from "../../../Firebase/firebase.js";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {
  notification
} from "antd";
import * as Yup from 'yup';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router.js";

const Index = () => {
  const [errors, setErrors] = useState({});

  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  let userId
  let user
  try {
    user = auth.currentUser;
    userId = user.uid
  } catch (error) {
    console.log(error)
  }

  const admin = {
    name: "James William",
    first: "James",
    last: "Williams",
    email: "james@email.com",
    phone: "+91 65765767 6",
    country: "USA",
    city: "New York",
    postal: "5676877",
    address: "333 St Paun, New York , USA",
    password: "abcd123"
  };

  const { data, isLoading, isError } = useQuery(
    ['Admins'],
    async () => {

      const response = await AdminApi.getUserByUserId(userId);
      return response;// Assuming your API returns data property

    }
  );
  console.log(data)
  const [formData, setFormData] = useState({
    firstName: data && data.firstName,
    lastName: data && data.lastName,
    email: data && data.email,
    phone: data && data.phone,
    country: data && data.country,
    register: data && data.register,
    address: data && data.address,
    password: admin.password,
    city: data && data.city,

  });

  console.log("FORM", formData)

  const [isFormEdited, setIsFormEdited] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsFormEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // await validationSchema.validate(formData, { abortEarly: false });
      console.log('Form data is valid:', formData);
      // setLoading(true);



      const values = {
        firstName: formData.firstName,
        email: formData.email,
        lastName: formData.lastName,
        country: formData.country,
        phone: formData.phone,
        address: formData.address,
        city: formData.address,
      };

      const ref = doc(db, "Admins", userId);
      await setDoc(ref, values, { merge: true });
      notification.open({
        type: "success",
        message: "Successfully Updated!",
        placement: "top",
      });





      // setLoading(false);



    } catch (error) {

      if (error instanceof Yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        // setLoading(false);

      }
      else {
        const message = error.message
        var modifiedText = message.replace("Firebase:", '');
        setErrors("");

        notification.open({
          type: "error",
          message: modifiedText,
          placement: "top",
        });

        console.log("FIREBASE ERROR", error)


        // setLoading(false);
      }





    }



  };

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



  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "repeatPassword") {
      setRepeatPassword(value);
    }
  };

  useEffect(() => {
    if (newPassword === repeatPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }, [newPassword, repeatPassword]);


  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("LOGED IN USER", userId)

    if (newPassword === repeatPassword) {
      if ((newPassword !== "" || repeatPassword !== "")) {
        const credential = EmailAuthProvider.credential(data?.email, currentPassword);

        // Reauthenticate the user
        reauthenticateWithCredential(user, credential)
          .then(() => {
            // Reauthentication successful, update the password
            updatePassword(user, newPassword)
              .then(() => {
                notification.open({
                  type: "success",
                  message: "Password updated successfully",
                  placement: "top",
                });
                setCurrentPassword('');
                setNewPassword('');
                setPasswordMatch('')
              })
              .catch((error) => {
                console.log("Error updating password: " + error.message);
              });
          })
          .catch((error) => {
            if (error.message === "Firebase: Error (auth/wrong-password).") {
              notification.open({
                type: "error",
                message: "Wrong current password",
                placement: "top",
              });
            }
            if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
              notification.open({
                type: "error",
                message: "Too many attempts wrong try later! ",
                placement: "top",
              });
            }
            console.log("Error reauthenticating: " + error.message);
          });

      }
      else {
        message.error("Please enter password to update")
        return;
      }

    } else {

      message.error("Passwords do not match. Please try again.");
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (isError) {
    return <h1>Error</h1>
  }


  return (
    <div className="w-full bg-[F9F9F9]">
      <Head>
        <title>Profile</title>
      </Head>
      <div className="h-full w-full  my-4 overflow-hidden">
        <div className="w-full h-full flex md:flex-row flex-col items-start md:justify-start my-5 md:px-6 px-4 md:px-0 ">
          <div className=" w-full md:w-[50%] xl:md-[50%] flex md:flex-col flex-wrap  ">
            <div className="flex flex-col flex-grow  bg-[#FFFFFF] shadow-sm rounded-md px-5 py-5  md:w-full">
              <h2 className="font-[500] text-[18px]">My Profile</h2>
              <div className="mb-3 mt-5 flex items-center">
                {/* <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/admin.svg" width={64} height={64} alt="Admin Image" />
                </div> */}
                <div>
                  <p className="text-[18px] font-normal text-[#000000]">{data?.firstName} {data?.lastName} </p>
                  <p className="text-[16px] font-normal text-[#777777]">Admin</p>
                </div>
              </div>
              <div className="my-3">
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Full Name:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.firstName} {data?.lastName}</p>
                </div>
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Mobile:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.phone}</p>
                </div>
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Email:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.email}</p>
                </div>
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Location:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.address}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:flex-row flex flex-col   my-5 md:my-0 sm:mx-4 gap-4">
            <div className="w-full  bg-[#FFFFFF] shadow-sm rounded-md py-5">
              <div className="px-6">
                <h2 className="font-[500] text-[18px]">Edit Profile</h2>
              </div>

              <form className="my-3 border-b border-[#DFDFDF] px-6 pb-6" onSubmit={handleSubmit}>
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
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
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
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
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
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
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
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div>
                  {/* <div className="w-full">
                    <label
                      htmlFor="register"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Register As
                    </label>
                    <input
                      type="text"
                      id="register"
                      name="register"
                      value={formData.register}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div> */}
                </div>
                {/* <div className="mt-4">
                  <label
                    htmlFor="about"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    About Me
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    placeholder="Write here..."
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    rows={4}
                    style={{ resize: "none" }}
                  />
                </div> */}
                <div className="w-full flex justify-center sm:justify-end ">
                  <button
                    type="submit"
                    className="mt-6 bg-[#A51F6C] text-white py-2 px-4 rounded transition duration-300 hover:bg-[#E82494]"
                  >
                    Update Profile
                  </button>

                </div>

              </form>
              <form className="my-3  px-6 pb-6" onSubmit={handlePasswordSubmit}>
                <div className="">
                  <h2 className="font-[500] text-[18px]">Change Password</h2>
                </div>
                <div className="mt-3">
                  <div className="flex flex-col lg:flex-row items-start gap-x-4 mt-4 pb-3 w-full">
                    <div className="sm:w-[50%] w-full">
                      <label className="text-[16px] font-normal text-[#777777]">
                        Current Password:
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        onChange={(e) => { setCurrentPassword(e.target.value) }}
                        value={currentPassword}
                        name="currentPassword"
                        placeholder="Enter Current password"
                        className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                      />
                    </div>

                    <div className="sm:w-[50%] w-full lg:ml-4">
                      <label className="text-[16px] font-normal text-[#777777]">
                        New Password:
                      </label>
                      <Input.Password
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className="w-full py-2 fontFamily px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                        placeholder="New Password"
                      />
                    </div>


                    <div className="md:w-[50%] w-full">
                      <label className="text-[16px] font-normal text-[#777777]">
                        Repeat Password:
                      </label>
                      <Input.Password
                        id="repeatPassword"
                        name="repeatPassword"
                        value={repeatPassword}
                        onChange={handlePasswordChange}
                        className={`w-full py-2 px-3 border fontFamily ${passwordMatch
                          ? "border-[#2668E81A]"
                          : "border-[#FF0000]"
                          } rounded transition duration-300 bg-[#2668E803] focus:outline-none ${passwordMatch
                            ? "focus:border-[#2668E855] hover:border-[#2668E855]"
                            : "focus:border-[#FF0000] hover:border-[#FF0000]"
                          }`}
                        placeholder="Repeat Password"
                      />
                      {!passwordMatch && (
                        <p className="text-red-600 mt-2">
                          Passwords do not match. Please try again.
                        </p>
                      )}
                    </div>

                  </div>


                  <div className="w-full flex justify-center sm:justify-end">
                    <button
                      type="submit"
                      className=" bg-[#A51F6C] text-white py-2 px-4 rounded transition duration-300 hover:bg-[#E82494]"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
