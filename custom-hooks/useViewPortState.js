import { useEffect, useState } from "react"

export const useViewPortState = () => {
    const [scrollPosition,setScrollPosition] = useState(0);
    const [viewWidth,setViewWidth] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(parseInt(window.scrollY));
        }
        window.addEventListener('scroll',updatePosition);
        const updateViewSize = () => {
            setViewWidth(parseInt(innerWidth));
        }
        window.addEventListener('resize',updateViewSize);
        updatePosition();
        updateViewSize();

        return () => {
            window.removeEventListener('scroll',updatePosition);
            window.removeEventListener('resize',updateViewSize);
        }
    },[]);

    return [viewWidth,scrollPosition];
}