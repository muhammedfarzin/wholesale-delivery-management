import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TokensState {
  accessToken: string;
  refreshToken: string;
}

interface SetAuthPayload {
  tokens: TokensState;
  role: "admin" | "driver";
}

interface AuthState {
  driver: boolean;
  admin: boolean;
}

const initialState: AuthState = {
  driver: false,
  admin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<SetAuthPayload>) => {
      const { tokens, role } = action.payload;

      if (role === "admin") {
        localStorage.setItem("adminAccessToken", tokens.accessToken);
        localStorage.setItem("adminRefreshToken", tokens.refreshToken);
        state.admin = true;
      } else if (role === "driver") {
        localStorage.setItem("driverAccessToken", tokens.accessToken);
        localStorage.setItem("driverRefreshToken", tokens.refreshToken);
        state.driver = true;
      }
    },
    logout: (
      state,
      action: PayloadAction<{ role: "admin" | "driver"; force?: boolean }>
    ) => {
      const { role, force } = action.payload;

      if (force) {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
      }

      if (role === "driver") {
        state.driver = false;
        localStorage.removeItem("driverAccessToken");
        localStorage.removeItem("driverRefreshToken");
      } else if (role === "admin") {
        state.admin = false;
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
      }
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
