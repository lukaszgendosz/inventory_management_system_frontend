import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useUserService from "../services/api/users";

const PersistLogin = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const {getCurrentUser} = useUserService();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh().then((access_token) => {
                     getCurrentUser(access_token ? access_token : "").then(res => {
                        const current_user = res.data
                        setAuth(prev => {
                            return { ...prev,
                                current_user: current_user,
                                is_loaded: true
                            }
                        });
                    });
                });
                
            } catch (err) {
                localStorage.removeItem('refresh_token');
                navigate('/login');
            }
        }

        !auth?.access_token && verifyRefreshToken();
    }, []);

    return (
        <>
        <Outlet />
        </> 
    )
}

export default PersistLogin