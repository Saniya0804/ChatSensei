"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            alert("Please enter username and password");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:8000/login/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("userid", data.userid);
                localStorage.setItem("token", data.token);

                router.push("/dashboard");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Unable to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo / Brand */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/20">
                        <span className="text-2xl">📄</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        ChatSensei
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Turn your documents into intelligent conversations
                    </p>

                </div>


                {/* Login Card */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

                    <div className="mb-6">

                        <h2 className="text-2xl font-semibold text-white">
                            Welcome back
                        </h2>

                        <p className="text-slate-400 text-sm mt-1">
                            Sign in to continue to your workspace
                        </p>

                    </div>


                    {/* Username */}

                    <div className="mb-5">

                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-600"
                        />

                    </div>


                    {/* Password */}

                    <div className="mb-6">

                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                            className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-600"
                        />

                    </div>


                    {/* Login Button */}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>


                    {/* Register */}

                    <p className="text-center text-slate-400 text-sm mt-6">

                        Don't have an account?{" "}

                        <Link
                            href="/register"
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Create account
                        </Link>

                    </p>

                </div>


                {/* Footer */}

                <p className="text-center text-slate-600 text-xs mt-6">
                    AI-powered document intelligence
                </p>

            </div>

        </div>
    );
}

export default Login;