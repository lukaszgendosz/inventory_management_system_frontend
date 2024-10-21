import axios from '../services/api/axios';
import { useAuth } from './useAuth';
import { TokenResponseScheme } from '../models/token';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const refresh = async () => {
        try {
            
            const response = await axios<TokenResponseScheme>({
                url: '/api/refresh',
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("refresh_token")}` },
            });
            setAuth(prev => {
                return { ...prev,
                    access_token: response.data.access_token,
                    role: response.data.role}
            });
            return response.data.access_token;
        } catch (err) {
            localStorage.removeItem('refresh_token');
            navigate('/login');
        }
    }
    return refresh;
};

export default useRefreshToken;