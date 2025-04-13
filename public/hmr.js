/**
 * Vite HMR Helper
 * 
 * This script helps ensure that all content is properly updated through HMR after git pull operations.
 * It uses Vite's internal HMR API to invalidate modules and trigger proper hot reloading.
 */

(function() {
  console.log('[ViteHMR] Starting Vite HMR helper');
  
  // Store the time when the page was initially loaded
  const pageLoadTime = Date.now();
  let hmrAttempted = false;
  
  // Function to force HMR update using Vite's internal API
  function triggerHMR() {
    if (hmrAttempted) return;
    hmrAttempted = true;
    
    console.log('[ViteHMR] Attempting to trigger Vite HMR update');
    
    try {
      // Try to access Vite's HMR API
      if (import.meta && import.meta.hot) {
        console.log('[ViteHMR] Using import.meta.hot API');
        
        // Force HMR invalidation on the current module
        import.meta.hot.invalidate();
        
        // Additionally attempt to trigger a full reload
        // This is necessary for CSS changes that might not be caught
        if (import.meta.hot.data) {
          import.meta.hot.data.forceReload = true;
        }
        
        return true;
      }
      
      // Fallback: look for Vite's HMR global object
      const viteHotContext = window.__vite_hot__ || 
                            window.__vite__ || 
                            window.__HMR__ || 
                            window.__VUE_HMR_RUNTIME__;
      
      if (viteHotContext) {
        console.log('[ViteHMR] Using Vite global HMR context');
        
        // Different Vite versions have different APIs
        if (typeof viteHotContext.invalidateAll === 'function') {
          viteHotContext.invalidateAll();
          return true;
        }
        
        if (typeof viteHotContext.invalidate === 'function') {
          viteHotContext.invalidate();
          return true;
        }
        
        if (viteHotContext.flush && typeof viteHotContext.flush === 'function') {
          viteHotContext.flush();
          return true;
        }
      }
      
      // Last resort - try to find and call any function that might be related to HMR
      for (const key in window) {
        if (/vite|hmr|hot/i.test(key) && typeof window[key] === 'object') {
          const obj = window[key];
          
          for (const method in obj) {
            if (/invalidate|update|refresh|reload/i.test(method) && typeof obj[method] === 'function') {
              console.log(`[ViteHMR] Found potential HMR method: ${key}.${method}`);
              try {
                obj[method]();
                return true;
              } catch (e) {
                console.warn(`[ViteHMR] Error calling ${key}.${method}:`, e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[ViteHMR] Error triggering HMR:', error);
    }
    
    console.warn('[ViteHMR] Could not find Vite HMR API, falling back to full page reload');
    
    // If all HMR methods fail, fall back to a full page reload
    setTimeout(() => {
      window.location.reload(true);
    }, 100);
    
    return false;
  }
  
  // Create websocket connection to listen for file changes
  function setupWebsocketListener() {
    try {
      // Try to find Vite's websocket URL from any script tag
      const viteScripts = Array.from(document.querySelectorAll('script[src*="@vite/client"]'));
      let wsUrl = null;
      
      for (const script of viteScripts) {
        const url = new URL(script.src);
        wsUrl = `${url.protocol === 'https:' ? 'wss:' : 'ws:'}//${url.host}`;
      }
      
      // If we couldn't find it, use default Vite dev server websocket URL
      if (!wsUrl) {
        const currentUrl = new URL(window.location.href);
        wsUrl = `${currentUrl.protocol === 'https:' ? 'wss:' : 'ws:'}//${currentUrl.host}`;
      }
      
      // Connect to websocket
      const socket = new WebSocket(`${wsUrl}/__vite_hmr`);
      
      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // If we receive any HMR message, it means files have changed
          if (data.type && /update|change|reload/i.test(data.type)) {
            console.log(`[ViteHMR] Received HMR message type: ${data.type}`);
            
            // Trigger HMR reload
            triggerHMR();
          }
        } catch (e) {
          console.warn('[ViteHMR] Error processing websocket message:', e);
        }
      });
      
      socket.addEventListener('open', () => {
        console.log('[ViteHMR] Websocket connection established');
      });
      
      socket.addEventListener('error', (error) => {
        console.warn('[ViteHMR] Websocket error:', error);
      });
    } catch (error) {
      console.warn('[ViteHMR] Error setting up websocket listener:', error);
    }
  }

  // Trigger HMR after page loads
  setTimeout(() => {
    // Only try HMR if the page was loaded recently
    const timeOnPage = Date.now() - pageLoadTime;
    if (timeOnPage < 60000) { // 60 seconds
      triggerHMR();
    }
  }, 1500); // Wait 1.5 seconds to let everything initialize
  
  // Attempt to set up websocket listener for future changes
  setTimeout(setupWebsocketListener, 2000);
  
  // Expose API for manual triggering
  window.viteHMRHelper = {
    triggerHMR: triggerHMR,
    resetFlag: function() {
      hmrAttempted = false;
    }
  };
  
  console.log('[ViteHMR] Vite HMR helper initialized');
})();