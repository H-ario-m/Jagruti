/**
 * Universal Video Skip Buttons - Content Script
 * Adds 10-second forward/backward buttons to ANY video player
 * Works on YouTube, Vimeo, Netflix, Twitch, and more
 */

(function() {
  'use strict';

  // Track processed videos to avoid duplicate button injection
  const processedVideos = new WeakSet();
  const videoObservers = new WeakMap();
  
  // Platform-specific configurations
  const PLATFORMS = {
    youtube: {
      domain: 'youtube.com',
      videoSelector: 'video.html5-main-video',
      controlsSelector: '.ytp-left-controls',
      insertPosition: 'afterPlayButton',
      playButtonSelector: '.ytp-play-button',
      skipShorts: true
    },
    vimeo: {
      domain: 'vimeo.com',
      videoSelector: 'video',
      controlsSelector: '.vp-controls-wrapper .vp-controls',
      insertPosition: 'start'
    },
    netflix: {
      domain: 'netflix.com',
      videoSelector: 'video',
      controlsSelector: '.PlayerControlsNeo__layout .PlayerControlsNeo__button-control-row',
      insertPosition: 'start'
    },
    twitch: {
      domain: 'twitch.tv',
      videoSelector: 'video',
      controlsSelector: '.player-controls__left-control-group',
      insertPosition: 'end'
    },
    twitter: {
      domain: 'twitter.com',
      videoSelector: 'video',
      controlsSelector: '[data-testid="videoPlayer"]',
      insertPosition: 'overlay'
    },
    reddit: {
      domain: 'reddit.com',
      videoSelector: 'video',
      controlsSelector: 'video',
      insertPosition: 'overlay'
    },
    // Generic fallback
    generic: {
      videoSelector: 'video',
      controlsSelector: null,
      insertPosition: 'overlay'
    }
  };

  // SVG icons
  const BACKWARD_ICON = `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor" font-weight="bold">10</text></svg>`;
  
  const FORWARD_ICON = `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor" font-weight="bold">10</text></svg>`;

  /**
   * Detect current platform
   */
  function detectPlatform() {
    const hostname = window.location.hostname;
    
    for (const [key, config] of Object.entries(PLATFORMS)) {
      if (config.domain && hostname.includes(config.domain)) {
        return { name: key, config };
      }
    }
    
    return { name: 'generic', config: PLATFORMS.generic };
  }

  /**
   * Skip video forward or backward
   */
  function skipVideo(video, seconds) {
    if (!video || video.readyState === 0) return;
    
    const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration || Infinity));
    video.currentTime = newTime;

    // Dispatch keyboard events for platforms that rely on them
    dispatchKeyboardEvent(video, seconds > 0 ? 'ArrowRight' : 'ArrowLeft');
  }

  /**
   * Dispatch keyboard event (fallback for some platforms)
   */
  function dispatchKeyboardEvent(element, key) {
    const event = new KeyboardEvent('keydown', {
      key: key,
      code: key,
      keyCode: key === 'ArrowRight' ? 39 : 37,
      which: key === 'ArrowRight' ? 39 : 37,
      bubbles: true,
      cancelable: true
    });
    
    (element.parentElement || document).dispatchEvent(event);
  }

  /**
   * Create skip buttons
   */
  function createSkipButtons(video, platform) {
    const container = document.createElement('div');
    container.className = 'uvs-skip-buttons-container';
    container.dataset.uvsButtons = 'true';

    // Backward button
    const backwardBtn = document.createElement('button');
    backwardBtn.className = 'uvs-skip-button uvs-backward';
    backwardBtn.setAttribute('aria-label', 'Skip backward 10 seconds');
    backwardBtn.innerHTML = BACKWARD_ICON;
    backwardBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      skipVideo(video, -10);
    });

    // Forward button
    const forwardBtn = document.createElement('button');
    forwardBtn.className = 'uvs-skip-button uvs-forward';
    forwardBtn.setAttribute('aria-label', 'Skip forward 10 seconds');
    forwardBtn.innerHTML = FORWARD_ICON;
    forwardBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      skipVideo(video, 10);
    });

    container.appendChild(backwardBtn);
    container.appendChild(forwardBtn);

    // Add platform-specific class
    container.classList.add(`uvs-platform-${platform}`);

    return container;
  }

  /**
   * Find the best insertion point for buttons
   */
  function findInsertionPoint(video, config) {
    // Try platform-specific controls selector
    if (config.controlsSelector) {
      const controls = video.closest(config.controlsSelector) || 
                       document.querySelector(config.controlsSelector);
      if (controls) return { element: controls, type: 'controls' };
    }

    // Try to find any control bar near the video
    const parent = video.parentElement;
    if (parent) {
      // Look for common control class names
      const controlSelectors = [
        '[class*="control"]',
        '[class*="player-control"]',
        '[class*="video-control"]',
        '[class*="toolbar"]',
        '[class*="bottom-bar"]'
      ];

      for (const selector of controlSelectors) {
        const controls = parent.querySelector(selector);
        if (controls && controls !== video) {
          return { element: controls, type: 'controls' };
        }
      }
    }

    // Fallback: overlay on video container
    return { element: video.parentElement || video, type: 'overlay' };
  }

  /**
   * Insert buttons into the player
   */
  function insertButtons(video, buttons, config) {
    const { element, type } = findInsertionPoint(video, config);
    
    if (!element) return false;

    if (type === 'overlay') {
      // Create overlay container
      buttons.classList.add('uvs-overlay-mode');
      
      // Position relative to video
      const videoRect = video.getBoundingClientRect();
      if (videoRect.width > 200 && videoRect.height > 100) {
        element.style.position = 'relative';
        element.appendChild(buttons);
        return true;
      }
      return false;
    } else {
      // Insert into controls
      const playButton = element.querySelector(config.playButtonSelector || '[class*="play"]');
      
      if (config.insertPosition === 'afterPlayButton' && playButton && playButton.nextSibling) {
        element.insertBefore(buttons, playButton.nextSibling);
      } else if (config.insertPosition === 'start') {
        element.insertBefore(buttons, element.firstChild);
      } else {
        element.appendChild(buttons);
      }
      return true;
    }
  }

  /**
   * Check if video is valid for button injection
   */
  function isValidVideo(video) {
    // Skip if already processed
    if (processedVideos.has(video)) return false;

    // Skip invisible or tiny videos
    const rect = video.getBoundingClientRect();
    if (rect.width < 200 || rect.height < 100) return false;

    // Skip if video doesn't support seeking
    if (video.duration === Infinity || isNaN(video.duration)) {
      // Allow for live streams with DVR
      if (!video.seekable || video.seekable.length === 0) return false;
    }

    // Platform-specific exclusions
    const platform = detectPlatform();
    if (platform.name === 'youtube' && platform.config.skipShorts) {
      if (window.location.pathname.includes('/shorts/')) return false;
    }

    return true;
  }

  /**
   * Process a single video element
   */
  function processVideo(video) {
    if (!isValidVideo(video)) return;

    const platform = detectPlatform();
    
    // Wait for video to be ready
    const checkReady = () => {
      if (video.readyState < 2) {
        video.addEventListener('loadedmetadata', () => {
          processVideoDelayed(video, platform);
        }, { once: true });
      } else {
        processVideoDelayed(video, platform);
      }
    };

    checkReady();
  }

  /**
   * Process video after it's ready
   */
  function processVideoDelayed(video, platform) {
    if (processedVideos.has(video)) return;
    
    // Check again if valid (dimensions might have changed)
    if (!isValidVideo(video)) return;

    const buttons = createSkipButtons(video, platform.name);
    
    // Try to insert buttons
    const inserted = insertButtons(video, buttons, platform.config);
    
    if (inserted) {
      processedVideos.add(video);
      
      // Setup visibility sync for overlay mode
      if (buttons.classList.contains('uvs-overlay-mode')) {
        setupOverlayVisibility(video, buttons);
      }

      // Cleanup on video removal
      const cleanupObserver = new MutationObserver((mutations) => {
        if (!document.contains(video)) {
          buttons.remove();
          cleanupObserver.disconnect();
          processedVideos.delete(video);
        }
      });

      cleanupObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Setup visibility sync for overlay buttons
   */
  function setupOverlayVisibility(video, buttons) {
    const container = video.parentElement;
    if (!container) return;

    let hideTimeout;

    const showButtons = () => {
      buttons.classList.add('uvs-visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        buttons.classList.remove('uvs-visible');
      }, 3000);
    };

    const hideButtons = () => {
      clearTimeout(hideTimeout);
      buttons.classList.remove('uvs-visible');
    };

    // Show on mouse move, hide after idle
    container.addEventListener('mousemove', showButtons);
    container.addEventListener('mouseenter', showButtons);
    container.addEventListener('mouseleave', hideButtons);

    // Show when video plays/pauses
    video.addEventListener('play', showButtons);
    video.addEventListener('pause', showButtons);
    video.addEventListener('seeking', showButtons);

    // Show on touch
    container.addEventListener('touchstart', showButtons);
  }

  /**
   * Scan for videos in the page
   */
  function scanForVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!processedVideos.has(video)) {
        processVideo(video);
      }
    });
  }

  /**
   * Setup mutation observer for dynamically added videos
   */
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;

      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              if (node.tagName === 'VIDEO' || node.querySelector('video')) {
                shouldScan = true;
                break;
              }
            }
          }
        }
        if (shouldScan) break;
      }

      if (shouldScan) {
        setTimeout(scanForVideos, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  /**
   * Initialize extension
   */
  function initialize() {
    // Initial scan
    scanForVideos();

    // Watch for new videos
    setupMutationObserver();

    // Re-scan on page navigation (SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(scanForVideos, 500);
      }
    }).observe(document.body, { subtree: true, childList: true });

    // Handle YouTube-specific navigation
    document.addEventListener('yt-navigate-finish', () => {
      setTimeout(scanForVideos, 300);
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
