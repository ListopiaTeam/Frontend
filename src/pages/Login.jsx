import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Alert from "../components/Alert";

const Login = () => {
  const { message, signInUser, user, setMessage } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const timeoutId = useRef(null); 
  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => navigate('/'), 5000);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      await signInUser(email, password);

      if (message?.signin) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }


    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <div className="mt-32 flex justify-center">
      <form
        onSubmit={handleLogin}
        className="max-w-lg m-auto gap-5 flex flex-col mx-5"
      >
        <h2 className="text-center text-3xl font-semibold">Login</h2>

        <label
          htmlFor="UserEmail"
          className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 text-slate-600 select-none"
        >
          <input
            type="email"
            name="email"
            id="UserEmail"
            placeholder="Email"
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-slate-600 select-none"
            required
          />
          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none">
            Email
          </span>
        </label>

        <label
          htmlFor="password"
          className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Password"
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            required
          />
          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none">
            Password
          </span>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePasswordVisibility();
            }}
            className="absolute right-3 top-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showPassword ? <p>Hide</p> : <p>Show</p>}
          </button>
        </label>

        <button
          className="block rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {message?.signin ? (
          <Alert msg={message.signin} />
        ) : (
          message?.err && <Alert err={message.err} />
        )}

        <p className="text-center mb-5">
          Don't have an account yet?{" "}
          <NavLink className="text-rose-600" to="/register">
            Register
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
