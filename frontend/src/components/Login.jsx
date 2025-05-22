import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", { email, password });
            const { access_token, role } = response.data;
            localStorage.setItem("token", access_token);
            localStorage.setItem("role", role);

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/employee/dashboard");
            }
        } catch (err) { 
            setError("Invalid email or password");
        }
    };

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                            <div className="card-body p-5 text-center">
                                <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleLogin}>
                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="email"
                                            className="form-control form-control-s"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            type="password"
                                            className="form-control form-control-s"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-outline-light px-5">
                                        Login
                                    </button>
                                </form>

                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </section>
    );
};

export default Login;
