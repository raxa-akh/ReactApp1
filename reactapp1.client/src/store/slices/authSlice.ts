import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    username: string | null;
    role: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; username: string; role: string }>) {
            const { token, username, role } = action.payload;
            state.token = token;
            state.username = username;
            state.role = role;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
        },
        logout(state) {
            state.token = null;
            state.username = null;
            state.role = null;
            localStorage.clear();
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
