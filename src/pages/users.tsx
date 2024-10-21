import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { PaginationResponseSchemeUserResponseScheme} from "../models/user";
import { UserResponseScheme } from "../models/user";
import userTable from "../components/userTable";

const Users = () => {
    const [users, setUsers] = useState<UserResponseScheme[]>([] as UserResponseScheme[]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate<PaginationResponseSchemeUserResponseScheme>({
                    url: '/api/v1/users',
                    signal: controller.signal
                });
                isMounted && setUsers(response.data.data);
            } catch (err) {
                
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <>{userTable}</>
    );
};

export default Users;