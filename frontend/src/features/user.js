import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user',
    initialState : { value: { username : "", userId : "", email : ""}},
    reducers : {
        login: (state, action) => {
            const { id, username, email } = action.payload;
            state.value = {
                ...state.value,
                userId: id,
                username: username,
                email: email
            };
        },

        logout: (state, action) => {
            state.value = { username : "", userId : "", email : ""}
        },

        signup : (state, action) => {
            state.value = action.payload;
        }
    }
});

export const {login, logout, signup} = userSlice.actions;

export default userSlice.reducer;