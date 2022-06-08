import { useEffect, useState } from 'react';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';

import { login, logout } from '../app/reducers/logginSlice';
import axios from 'axios';
import { set_user } from '../app/reducers/userSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = (access_token: string | null) =>{
    const dispatch = useAppDispatch();
    const [local_token, setLocalToken] = useState<string | null>("");
    useEffect(() => {
        let token = window.localStorage.getItem("token")

        if (!token && access_token) {
            token = access_token

            window.history.pushState({}, "", "/")
            window.localStorage.setItem("token", token)
        }

        setLocalToken(token)

    }, [])
    
    return local_token;
}