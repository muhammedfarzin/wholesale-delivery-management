import { useState } from "react";
import apiClient from "../apiClient";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, TokensState } from "../redux/reducers/auth";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

interface LoginProps {
  type: "admin" | "driver";
}

const Login: React.FC<LoginProps> = ({ type }) => {
  const dispatch = useDispatch();
  const authData = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading("Logging in...");
      if (!username.trim()) return toast.error("Username is required");
      else if (!password.trim()) return toast.error("Password is required");

      const role = type === "admin" ? "admin" : "truck_driver";

      const response = await apiClient.post(`/auth/login`, {
        username,
        password,
        role,
      });
      const tokens = response.data as TokensState;
      dispatch(setAuthUser({ tokens, role: type }));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setLoading(null);
    }
  };

  return !authData[type] ? (
    <div className="m-2 h-screen flex justify-center items-center">
      <form
        className="w-full max-w-md bg-sky-500 text-center p-4 rounded-md flex flex-col gap-2"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold capitalize">{type} Login</h1>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={type === "admin" ? "Username" : "Mobile"}
          className="input w-full"
        />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input w-full"
        />
        <button className="btn" type="submit" disabled={!!loading}>
          {loading ?? "Login"}
        </button>
      </form>
    </div>
  ) : (
    <Navigate to={type === "admin" ? "/admin" : "/"} replace />
  );
};

export default Login;
