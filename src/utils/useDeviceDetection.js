import { useState, useEffect } from 'react'

/**
 * Custom hook to detect mobile devices
 * Uses both CSS media query detection and user agent as fallback
 * Returns true for mobile/touch devices, false for desktop
 */
export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      // Primary method: CSS media query for touch devices
      const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)')
      
      // Fallback method: dimension-based detection
      const dimensionQuery = window.matchMedia('(max-width: 640px)')
      
      // User agent fallback for older browsers
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone']
      const isUserAgentMobile = mobileKeywords.some(keyword => userAgent.includes(keyword))
      
      // Determine if mobile: touch query OR dimension query OR user agent
      const mobile = touchQuery.matches || dimensionQuery.matches || isUserAgentMobile
      
      setIsMobile(mobile)
    }

    // Initial check
    checkDevice()

    // Listen for changes (orientation, window resize, etc.)
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)')
    const dimensionQuery = window.matchMedia('(max-width: 640px)')
    
    const handleChange = () => checkDevice()
    
    touchQuery.addEventListener('change', handleChange)
    dimensionQuery.addEventListener('change', handleChange)
    window.addEventListener('resize', handleChange)
    window.addEventListener('orientationchange', handleChange)

    // Cleanup
    return () => {
      touchQuery.removeEventListener('change', handleChange)
      dimensionQuery.removeEventListener('change', handleChange)
      window.removeEventListener('resize', handleChange)
      window.removeEventListener('orientationchange', handleChange)
    }
  }, [])

  return isMobile
}

export default useDeviceDetection
