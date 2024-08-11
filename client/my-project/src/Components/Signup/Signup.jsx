import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom'; 

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();


    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3100/signup', {
                name: name,
                email: email,
                password: password,
            });

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                }).then((result) => {
                    if (result.isConfirmed) {
                        
                        navigate('/'); 
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message ,
                });
            }
            
            // Reset form fields after successful submission
            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {
            console.error("Signup error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to sign up. Please try again.",
            });
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 to-pink-500">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
                <h2 className="text-3xl mb-4 font-bold text-center text-gray-800">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>

                   

                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign Up
                    </button>

                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Already have an account?</span>{" "}
                        <Link to="/" className="text-pink-500 hover:text-pink-700 text-sm font-bold">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;



