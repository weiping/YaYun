/**
 * browser-compatibility.js
 * 浏览器兼容性检测与修复工具
 * 用于雅韵(YaYun)应用检测和解决不同浏览器中的兼容性问题
 */

(function() {
  console.log('正在运行浏览器兼容性检测...');
  
  // 存储检测结果
  const compatibilityIssues = [];
  
  // 检测浏览器环境
  function detectBrowser() {
    const ua = navigator.userAgent;
    let browserName;
    let browserVersion;
    
    if (ua.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
      browserName = "Safari";
      browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || "未知";
    } else if (ua.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
      browserName = "IE";
      browserVersion = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Edge") > -1) {
      browserName = "Edge";
      browserVersion = ua.match(/Edge\/(\d+\.\d+)/)?.[1] || 
                       ua.match(/Edg\/(\d+\.\d+)/)?.[1] || "未知";
    } else {
      browserName = "未知浏览器";
      browserVersion = "未知";
    }
    
    return { name: browserName, version: browserVersion };
  }
  
  // 检测CSS特性支持
  function checkCSSSupport() {
    const features = {
      flexbox: 'display' in document.createElement('div').style,
      grid: 'grid-template-columns' in document.createElement('div').style,
      backdropFilter: 'backdropFilter' in document.createElement('div').style || 
                      'webkitBackdropFilter' in document.createElement('div').style,
      animations: 'animation' in document.createElement('div').style || 
                  'webkitAnimation' in document.createElement('div').style,
      transforms: 'transform' in document.createElement('div').style
    };
    
    // 检查不支持的特性
    for (const [feature, supported] of Object.entries(features)) {
      if (!supported) {
        compatibilityIssues.push({
          type: 'CSS',
          feature: feature,
          description: `不支持 ${feature} CSS特性`,
          severity: feature === 'flexbox' || feature === 'transforms' ? 'high' : 'medium'
        });
      }
    }
    
    return features;
  }
  
  // 检测JavaScript API支持
  function checkJSSupport() {
    const features = {
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      promise: typeof Promise !== 'undefined',
      requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
      touchEvents: 'ontouchstart' in window,
      intersectionObserver: typeof IntersectionObserver !== 'undefined'
    };
    
    // 检查不支持的特性
    for (const [feature, supported] of Object.entries(features)) {
      if (!supported) {
        compatibilityIssues.push({
          type: 'JavaScript',
          feature: feature,
          description: `不支持 ${feature} JavaScript API`,
          severity: feature === 'localStorage' || feature === 'promise' ? 'high' : 'medium'
        });
      }
    }
    
    return features;
  }
  
  // 修复已知的兼容性问题
  function applyCompatibilityFixes() {
    const browser = detectBrowser();
    console.log(`检测到浏览器: ${browser.name} ${browser.version}`);
    
    // Safari特定修复
    if (browser.name === "Safari") {
      // 修复Safari中的backdrop-filter问题
      document.querySelectorAll('[style*="backdrop-filter"]').forEach(el => {
        if (!el.style.webkitBackdropFilter) {
          el.style.webkitBackdropFilter = el.style.backdropFilter;
        }
      });
      
      // 修复Safari中的animation问题
      if (document.querySelector('.vinyl-record')) {
        const vinylStyle = document.createElement('style');
        vinylStyle.textContent = `
          @-webkit-keyframes rotateDisk {
            0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
          }
          
          .vinyl-record.playing {
            -webkit-animation-name: rotateDisk !important;
            -webkit-animation-duration: 20s !important;
            -webkit-animation-timing-function: linear !important;
            -webkit-animation-iteration-count: infinite !important;
            -webkit-animation-play-state: running !important;
            -webkit-animation-delay: 0s !important;
          }
        `;
        document.head.appendChild(vinylStyle);
      }
    }
    
    // 为不支持IntersectionObserver的浏览器添加polyfill
    if (typeof IntersectionObserver === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.min.js';
      document.head.appendChild(script);
    }
    
    // 为不支持Promise的浏览器添加polyfill
    if (typeof Promise === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js';
      document.head.appendChild(script);
    }
  }
  
  // 运行测试
  function runCompatibilityTest() {
    const browser = detectBrowser();
    const cssSupport = checkCSSSupport();
    const jsSupport = checkJSSupport();
    
    // 测试触摸优化相关功能
    if ('ontouchstart' in window) {
      // 检查触摸事件传播是否正常
      try {
        const touchTest = document.createElement('div');
        let touchEventWorking = false;
        
        touchTest.addEventListener('touchstart', () => {
          touchEventWorking = true;
        }, { passive: true });
        
        // 模拟触发触摸事件
        const testEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        touchTest.dispatchEvent(testEvent);
        
        if (!touchEventWorking) {
          compatibilityIssues.push({
            type: 'Touch',
            feature: 'touchEvents',
            description: '触摸事件可能无法正确工作',
            severity: 'medium'
          });
        }
      } catch (e) {
        console.warn('触摸事件测试失败:', e);
      }
    }
    
    // 测试动画性能
    try {
      let animationPerformance = 'good';
      let startTime = performance.now();
      let frameCount = 0;
      
      function testFrame(timestamp) {
        frameCount++;
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(testFrame);
        } else {
          // 如果帧率低于30fps，可能存在性能问题
          if (frameCount < 30) {
            animationPerformance = 'poor';
            compatibilityIssues.push({
              type: 'Performance',
              feature: 'animations',
              description: `动画性能可能较差 (${frameCount}fps)`,
              severity: 'medium'
            });
          }
        }
      }
      
      requestAnimationFrame(testFrame);
    } catch (e) {
      console.warn('性能测试失败:', e);
    }
    
    // 打印结果
    console.log('兼容性测试结果:', {
      browser,
      cssSupport,
      jsSupport,
      issues: compatibilityIssues
    });
    
    // 应用修复
    applyCompatibilityFixes();
    
    return {
      browser,
      cssSupport,
      jsSupport,
      issues: compatibilityIssues
    };
  }
  
  // 导出API
  window.yaYunCompatibilityTest = {
    run: runCompatibilityTest,
    getIssues: () => compatibilityIssues,
    applyFixes: applyCompatibilityFixes
  };
})(); 