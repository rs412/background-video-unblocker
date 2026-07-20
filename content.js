// Background Video Unblocker
// Block tab switch / window focus detection events
// Block visibilitychange, blur, pagehide, mouseleave etc.
// Fake document visibility & focus status, auto resume paused video
(async function() {
    'use strict';

    // 读取本地存储开关状态
    const storageData = await chrome.storage.local.get(['bvUnblockEnable']);
    const isEnable = storageData.bvUnblockEnable ?? true;

    // 关闭状态直接退出，不执行拦截
    if (!isEnable) return;

    // List of events to block website detection
    const blockedEventTypes = [
        'visibilitychange',
        'blur',
        'focus',
        'pagehide',
        'pageshow',
        'mouseleave'
    ];

    // Step 1: Hijack addEventListener to block registration of detect events
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(eventType, handler, options) {
        if (blockedEventTypes.includes(eventType)) {
            // Drop detect event listener directly
            return;
        }
        return originalAddEventListener.call(this, eventType, handler, options);
    };

    // Step 2: Intercept existing detect events in capture phase
    function interceptDetectEvent(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
    }
    window.addEventListener('visibilitychange', interceptDetectEvent, true);
    window.addEventListener('blur', interceptDetectEvent, true);
    window.addEventListener('pagehide', interceptDetectEvent, true);
    document.addEventListener('visibilitychange', interceptDetectEvent, true);

    // Step 3: Fake page visible & focused status
    Object.defineProperty(document, 'hidden', {
        value: false,
        writable: false
    });
    Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        writable: false
    });
    document.hasFocus = () => true;

    // Step 4: Timer to auto resume paused video
    setInterval(() => {
        const allVideoElements = document.querySelectorAll('video');
        allVideoElements.forEach(video => {
            if (video.paused && !video.ended) {
                video.play().catch(() => {});
            }
        });
    }, 800);

})();