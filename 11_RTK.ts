//App/store.ts

import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "@/features/auth/authSlice";
import { apiSlice } from "@/app/api/apiSlice";
import jobReducer from "@/features/job/jobDataSlice";
import bidReducer from "@/features/serviceProvider/bid/bidDataSlice"
import authReducer from "@/features/auth/authSlice"
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        job: jobReducer,
        bid: bidReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// slice

import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const storedAuth = localStorage.getItem("auth");
const isExist = storedAuth ? JSON.parse(storedAuth) : null;

type TInitialState = {
  email_verified: boolean | null;
  phone_verified: boolean | null;
  role: string | null;
  access_token: string | null;
  refresh_token: string | null;
  avatar: string | null;
  onboarding: number;
};

const initialState: TInitialState = {
  email_verified: isExist ? isExist.email_verified : null,
  phone_verified: isExist ? isExist.phone_verified : null,
  role: isExist ? isExist.role : null,
  access_token: isExist ? isExist.access_token : null,
  refresh_token: isExist ? isExist.refresh_token : null,
  avatar: isExist ? isExist.avatar : null,
  onboarding: isExist ? isExist.onboarding : 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state: TInitialState,
      action: PayloadAction<TInitialState>
    ) => {
      const {
        email_verified,
        phone_verified,
        role,
        access_token,
        refresh_token,
        avatar,
        onboarding,
      } = action.payload;
      state.email_verified = email_verified;
      state.phone_verified = phone_verified;
      state.role = role;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.avatar = avatar;
      state.onboarding = onboarding;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          email_verified,
          phone_verified,
          role,
          access_token,
          refresh_token,
          avatar,
          onboarding,
        })
      );
    },
    updateCredentials: (
      state: TInitialState,
      action: PayloadAction<Partial<TInitialState>>
    ) => {
      const updatedState = {
        ...state,
        ...action.payload,
      };

      state.email_verified = updatedState.email_verified;
      state.phone_verified = updatedState.phone_verified;
      state.role = updatedState.role;
      state.access_token = updatedState.access_token;
      state.refresh_token = updatedState.refresh_token;
      state.avatar = updatedState.avatar;
      state.onboarding = updatedState.onboarding;
      localStorage.setItem("auth", JSON.stringify(updatedState));
    },

    emailVerified: (state: TInitialState) => {
      state.email_verified = true;
      state.phone_verified = true;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...state,
          email_verified: state.email_verified,
          phone_verified: state.phone_verified,
        })
      );
    },
    updateOnboarding: (state: TInitialState) => {
      state.onboarding = state.onboarding + 1;
      localStorage.setItem("auth",JSON.stringify({...state,onboarding:state.onboarding}));
    },
    logout: (state: TInitialState) => {
      state.email_verified = null;
      state.phone_verified = null;
      state.role = null;
      state.access_token = null;
      state.refresh_token = null;
      state.avatar = null;
      state.onboarding = 0;
      localStorage.removeItem("auth");
    },
  },
});

export const {
  setCredentials,
  updateCredentials,
  logout,
  emailVerified,
  updateOnboarding,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentAuthData = (state: RootState) => state.auth;




//use of slice
const { access_token, role, email_verified, onboarding } = useSelector( selectCurrentAuthData);

const dispatch = useDispatch();  -> dispatch(logout());
