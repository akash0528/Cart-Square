import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import Api from "../Api/axios.js";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Api.get("/auth/get-me");
        setUser(res.data.user);
      } catch (error) {
        try {
          await Api.post("/auth/refresh-token");
          const res = await Api.get("/auth/get-me");
          setUser(res.data.user);
        } catch {
          setUser(null);
        }
      } finally {
        setloading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await Api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
    } catch (error) {
      setUser(null);
    }
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      // navigate("/signin"); // agar useNavigate available ho
      window.location.href = "/signin"; // hard redirect
    };

    window.addEventListener("force-logout", handleForceLogout);
    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, login, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
