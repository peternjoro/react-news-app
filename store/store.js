import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';

// configure redux store using redux toolkit
const store = configureStore({
    reducer: {
        'user': userReducer
    },
    devTools: true
});
export default store;