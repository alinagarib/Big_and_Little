import { useSession } from './ctx';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const { session } = useSession();
    
    if (session) {
        const decoded = jwtDecode(session);
        const { userId, profiles } = decoded.UserInfo;

        return { userId, profiles }
    }

    return { userId: '', profiles: [] };
};

export default useAuth;