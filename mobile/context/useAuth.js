import { useMemo } from 'react';
import { useSession } from './ctx';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const { session } = useSession();
    
    return useMemo(() => {
        if (session) {
            try {
                const decoded = jwtDecode(session);
                const { userId, profiles } = decoded.UserInfo;
    
                return { userId, profiles };
            } catch (error) {
                console.error("JWT Decode Error:", error);
            }
        }
    
        return { userId: '', profiles: [] };
    }, [session]);
};

export default useAuth;