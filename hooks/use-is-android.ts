import { useState, useEffect } from 'react';

export const useIsAndroid = () => {
    const [isAndroid, setIsAndroid] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for Android
        const android = /android/i.test(userAgent);
        setIsAndroid(android);
        
        // Check for any mobile device
        const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        setIsMobile(mobile);
    }, []);

    return { isAndroid, isMobile };
};
