import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

// Crear slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      sessionStorage.setItem('jwt', action.payload);
    },
    loadToken: (state) => {
      const token = sessionStorage.getItem('jwt');
      if (token) {
        state.token = token;
      }
    },
    clearToken: (state) => {
      state.token = null;
      sessionStorage.removeItem('jwt');
    },
  },
});

export const { setToken, loadToken, clearToken } = authSlice.actions;

// Configurar el store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;

// Selector y dispatch
export const useAuth = () => useSelector((state) => state.auth);
export const useAuthDispatch = () => useDispatch();
