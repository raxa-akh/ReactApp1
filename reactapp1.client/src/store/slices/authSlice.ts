import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    username: string | null;
    role: string | null;
    userId: number | null; 
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; username: string; role: string; userId: number }>) { 
            const { token, username, role, userId } = action.payload;
            state.token = token;
            state.username = username;
            state.role = role;
            state.userId = userId;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId.toString()); 
        },
        logout(state) {
            state.token = null;
            state.username = null;
            state.role = null;
            state.userId = null;
            localStorage.clear();
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
