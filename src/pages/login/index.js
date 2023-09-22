// import Wrapper from "@/components/shared/Wrapper";
// import Layout from "@/components/shared/layout/Layout";
import GeneralLayout from "@/layout/GeneralLayout.jsx";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Link from "next/link";
import { auth, db } from "../../../Firebase/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Yup from 'yup';
import { InfinitySpin } from 'react-loader-spinner'
import {
  notification
} from "antd";
import { Input, message } from "antd";

const Index = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [Show, setShow] = useState(false);

  const [formData, setFormData] = useState({

    email: '',
    password: '',


  });

  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({

    email: Yup.string().email('Invalid email').required('Email is required'),

    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be at least 6 characters'),


  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle radio buttons and checkbox
    const newValue = type === 'radio' ? value : type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await validationSchema.validate(formData, { abortEarly: false });
      console.log('Form data is valid:', formData);
      setLoading(true);

      await signInWithEmailAndPassword(auth, formData.email, formData.password);


      notification.open({
        type: "success",
        message: "Successfully Logged In!",
        placement: "top",
      });





      router.push('/');

      setLoading(false);



    } catch (error) {

      if (error instanceof Yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        console.log("VALIDATION ERROR", newErrors)

        setErrors(newErrors);
        setLoading(false);

      }
      else {
        if (error.message === "Firebase: Error (auth/wrong-password).") {
          notification.open({
            type: "error",
            message: "Wrong Password",
            placement: "top",
          });

        }
        else if (error.message === "Firebase: Error (auth/user-not-found).") {
          notification.open({
            type: "error",
            message: "Wrong Email",
            placement: "top",
          });
        }
        else if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
          notification.open({
            type: "error",
            message: "too many attempts try later! ",
            placement: "top",
          });

        }
        else {
          console.log("MESSAGE", error.message)
          const message = error.message
          var modifiedText = message.replace("Firebase:", '');
          setErrors("");

          notification.open({
            type: "error",
            message: modifiedText,
            placement: "top",
          });
        }



        console.log(error)


        setLoading(false);
      }





    }



  };

  return (
    <div className="mt-5">

      <GeneralLayout>


        <div>

          <div className="mt-20">
            <div>
              <form onSubmit={(e) => { handleSubmit(e) }}>
                <div className="flex flex-col justify-center items-center ">
                  <div className="bg-white md:w-[480px] flex flex-col shadow-xl text-center py-5 px-10">
                    <p className="text-[24px] font-[700] pb-5 text-[#A51F6C]">
                      Welcome!
                    </p>
                    <p className="text-[20px] font-[500] pb-7">
                      Hey! Enter your details to get sign into your account
                    </p>

                    <label
                      htmlFor="email"
                      className="text-left mb-3 text-[16px] font-[500] text-[#000000]"
                    >
                      {" "}
                      Email Address*
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="JohnDoe78@gmail.com"
                      className="md:w-[400px] h-[50px]  px-5 mb-5 border bg-[#B4C7ED0D] border-[#2668E826] rounded-md"
                    />
                    {errors.email && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 ">{errors.email}</div>}

                    <label
                      htmlFor="password"
                      className="text-left mb-3 text-[16px] font-[500] text-[#000000] "
                    >
                      {" "}
                      Password*
                    </label>

                    <Input.Password
                      type="password"

                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="md:w-[400px] h-[50px] px-5 bg-[#B4C7ED0D] border border-[#2668E826] rounded-md"
                    />
                    {errors.password && <div className="px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   ">{errors.password}</div>}

                    <div className="flex items-center justify-between my-4">
                      <label htmlFor="remember" className="flex items-center">
                        <input
                          type="checkbox"
                          id="remember"
                          className="mr-2 border border-gray-300 rounded-md  focus:ring focus:to-black"
                        />
                        Remember me
                      </label>
                      <Link
                        href="/forgot"
                        className="text-primary-pink-color hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="flex justify-center items-center">
                      {
                        loading ? <InfinitySpin
                          visible={true}
                          width="200"
                          ariaLabel="InfinitySpin -loading"
                          wrapperStyle={{}}
                          wrapperClass="InfinitySpin -wrapper"
                          color="#A51F6C"

                          // colors={['#F4442E', '#F4442E', '#F4442E', '#F4442E', '#F4442E']}
                          backgroundColor="#F4442E"
                        /> : <button
                          type="submit"
                          className="w-full ant-btn-primary text-white py-2 rounded-md hover:bg-primary-pink-color/90"

                        >
                          Log In
                        </button>
                      }
                    </div>



                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      </GeneralLayout >

    </div>
  );
};

export default Index;
