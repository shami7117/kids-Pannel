// pages/reset-password.js

import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { notification } from 'antd';
import { Button, Modal, Space } from 'antd';
import { useRouter } from 'next/router';


export default function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const success = () => {
        Modal.success({
            content: 'Email has been sent open inbox and reset your password !',

            onOk() {
                router.push('/login')
            },
        });
    };
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                success();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorMessage === "Firebase: Error (auth/user-not-found).") {
                    notification.open({
                        type: "error",
                        message: "This Email address not found",
                        placement: "top",
                    });
                }

                console.error(error);
            });


    };

    return (
        <div className='flex justify-center px-6 items-center h-[80vh]'>
            <div class="w-full p-6 bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md sm:p-8">
                <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-[#000] md:text-2xl ">
                    Reset Password
                </h2>
                <form onSubmit={(e) => { handleResetPassword(e) }} class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-[#000]">Your email*</label>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} name="email" id="email" className="block xl:w-96 w-72 mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                            placeholder="name@company.com" required="" />
                    </div>

                    <button type="submit" class="w-full text-white ant-btn-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Reset passwod</button>

                </form>
            </div>
        </div>
    );
}
