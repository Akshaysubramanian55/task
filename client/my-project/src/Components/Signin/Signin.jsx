import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Access to history object for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3100/signin', {
                email: email,
                password: password,
            });

            if (response.data) {
                console.log(response.data);
                const { token } = response.data;
                localStorage.setItem('token', token);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                });

                navigate('/Dashboard');

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Invalid credentials. Please try again.",
                });
            }

            // Reset form fields after successful submission
            setEmail("");
            setPassword("");

        } catch (error) {
            console.error("Signin error:", error);

            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Invalid credentials. Please try again.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to sign in. Please try again.",
                });
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md">
                <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">Sign In</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">Don't have an account? 
                        <Link to="/signup" className="text-indigo-500 hover:text-indigo-600 font-bold">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signin;
