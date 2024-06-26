import { useEffect, useRef, useState } from 'react';

interface NavAnimationReturn {
  /**
   * Whether the user is at the top of the page.
   */
  isAtTop: boolean;
  /**
   * Whether the navigation bar is hidden because the user is scrolling down.
   */
  isHidden: boolean;
}

/**
 * This function is used to hide or show the navigation bar
 * based on the scroll direction.
 */
export const useNavAnimation = (): NavAnimationReturn => {
  const lastScrollTop = useRef<number>(0);

  const [navState, setNavState] = useState<NavAnimationReturn>({
    isHidden: false,
    isAtTop: true
  });

  useEffect(() => {
    /**
     * Handle the scroll event when the page is loaded to
     * update the state of the navigation bar.
     */
    function handleScrollOnLoad() {
      setNavState((prevState) => ({
        ...prevState,
        isAtTop: window.scrollY === 0
      }));

      lastScrollTop.current = window.scrollY;
    }

    window.addEventListener('scroll', handleScrollOnLoad);

    /**
     * Remove the event listener after a delay since we only
     * want to trigger it once.
     */
    const timeoutId = setTimeout(() => {
      window.removeEventListener('scroll', handleScrollOnLoad);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('scroll', handleScrollOnLoad);
    };
  }, []);

  useEffect(() => {
    function handleScroll(): void {
      /**
       * Only update the state if the values have changed.
       */
      const updateNavState = (newValues: NavAnimationReturn) => {
        if (newValues.isHidden === navState.isHidden && newValues.isAtTop === navState.isAtTop) return;
        setNavState(newValues);
      };

      const currentScrollTop = window.scrollY;

      /**
       * If the user is at the top of the page or
       * scrolling up, the navigation bar should be visible.
       * If the user is scrolling down, the navigation bar should be hidden.
       */
      if (currentScrollTop === 0 || currentScrollTop < lastScrollTop.current) {
        updateNavState({
          isHidden: false,
          isAtTop: currentScrollTop === 0
        });
      } else if (currentScrollTop > lastScrollTop.current) {
        updateNavState({
          isHidden: true,
          isAtTop: false
        });
      }

      lastScrollTop.current = currentScrollTop;
    }

    /**
     * Add a delay to avoid triggering this scroll event when going back
     * from another page.
     */
    const timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navState]);

  return navState;
};
