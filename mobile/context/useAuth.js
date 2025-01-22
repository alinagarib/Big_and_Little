import { useSession } from './ctx';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const { session } = useSession();
    
    if (session) {
        const decoded = jwtDecode(session);
        const { username, admin_orgs } = decoded.UserInfo;

        return { username, admin_orgs }
    }

    return { username: '', admin_orgs: [] };
};

export default useAuth;