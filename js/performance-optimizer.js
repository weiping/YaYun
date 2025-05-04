/**
 * performance-optimizer.js
 * 雅韵(YaYun)应用性能优化工具
 * 用于提高应用的响应速度和加载性能
 */

(function() {
  console.log('正在初始化性能优化...');
  
  // 性能指标收集
  const metrics = {
    loadTime: 0,
    firstContentfulPaint: 0,
    interactionTime: 0,
    memoryUsage: {}
  };
  
  // 优化图片加载
  function optimizeImageLoading() {
    // 为所有图片添加懒加载
    document.querySelectorAll('img:not([loading])').forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
    
    // 监听可见性，提前加载即将可见的图片
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
            }
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px' // 在元素进入视口前200px就开始加载
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 降级方案：直接加载所有图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }
  
  // 优化事件监听器
  function optimizeEventListeners() {
    // 事件委托：为包含多个可点击元素的容器添加单个监听器
    const listContainers = document.querySelectorAll('.song-list, .album-list, .artist-list');
    
    listContainers.forEach(container => {
      // 避免重复添加
      if (container.hasAttribute('data-optimized')) return;
      
      // 移除子元素的直接事件
      container.querySelectorAll('.list-item').forEach(item => {
        const clone = item.cloneNode(true);
        item.parentNode.replaceChild(clone, item);
      });
      
      // 添加委托事件
      container.addEventListener('click', function(e) {
        const item = e.target.closest('.list-item');
        if (item) {
          const id = item.dataset.id;
          const type = item.dataset.type || container.dataset.itemType;
          
          console.log(`通过委托处理${type}点击，ID: ${id}`);
          
          // 触发自定义事件，以便其他代码可以响应
          const event = new CustomEvent('item-selected', {
            detail: { id, type, element: item }
          });
          container.dispatchEvent(event);
        }
      });
      
      container.setAttribute('data-optimized', 'true');
    });
    
    // 对滚动、调整大小等高频事件进行节流
    let scrollTimeout;
    const originalScroll = window.onscroll;
    
    window.onscroll = function(e) {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        if (typeof originalScroll === 'function') {
          originalScroll(e);
        }
      }, 100); // 100ms防抖
    };
  }
  
  // 预加载关键资源
  function preloadCriticalResources() {
    // 根据当前页面预测用户可能的下一个操作，预加载资源
    const currentPath = window.location.pathname;
    
    // 如果在首页，预加载播放页面资源
    if (currentPath.includes('home.html') || currentPath === '/') {
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'script';
      preload.href = '../js/rotateVinyl.js';
      document.head.appendChild(preload);
    }
    
    // 如果在播放页面，预加载歌词和音频
    if (currentPath.includes('player.html')) {
      // 预加载下一首可能的歌曲音频（实际产品中可以根据播放列表确定）
      const audioPreload = document.createElement('link');
      audioPreload.rel = 'preload';
      audioPreload.as = 'audio';
      audioPreload.href = '../assets/audio/next-song-preview.mp3';
      document.head.appendChild(audioPreload);
    }
  }
  
  // 优化动画性能
  function optimizeAnimations() {
    // 对动画元素应用will-change属性，但避免过度使用
    const animatedElements = document.querySelectorAll(
      '.vinyl-record, .tonearm-container, .progress-bar, .play-button'
    );
    
    animatedElements.forEach(el => {
      // 避免重复设置
      if (el.hasAttribute('data-optimized-animation')) return;
      
      if (el.classList.contains('vinyl-record')) {
        el.style.willChange = 'transform';
      } else if (el.classList.contains('progress-bar')) {
        el.style.willChange = 'width';
      } else {
        el.style.willChange = 'transform, opacity';
      }
      
      el.setAttribute('data-optimized-animation', 'true');
    });
    
    // 使用requestAnimationFrame优化动画
    const jsAnimatedElements = document.querySelectorAll('[data-js-animation]');
    
    jsAnimatedElements.forEach(el => {
      // 避免重复优化
      if (el.hasAttribute('data-optimized-js-animation')) return;
      
      // 获取原始动画函数
      const originalFn = window[el.dataset.jsAnimation];
      
      if (typeof originalFn === 'function') {
        // 创建RAF包装函数
        window[el.dataset.jsAnimation] = function(...args) {
          requestAnimationFrame(() => {
            originalFn(...args);
          });
        };
      }
      
      el.setAttribute('data-optimized-js-animation', 'true');
    });
  }
  
  // 监测内存使用
  function monitorMemoryUsage() {
    // 每30秒检查一次内存使用
    setInterval(() => {
      if (performance && performance.memory) {
        metrics.memoryUsage = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
        
        // 检测内存泄漏
        if (metrics.memoryUsage.usedJSHeapSize > metrics.memoryUsage.totalJSHeapSize * 0.9) {
          console.warn('内存使用率过高，可能存在内存泄漏');
        }
      }
    }, 30000);
  }
  
  // 收集性能指标
  function collectPerformanceMetrics() {
    // 页面加载时间
    window.addEventListener('load', () => {
      metrics.loadTime = performance.now();
      
      // 首次内容绘制时间
      if (window.performance && window.performance.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        if (firstContentfulPaint) {
          metrics.firstContentfulPaint = firstContentfulPaint.startTime;
        }
      }
      
      console.log('页面加载性能指标:', {
        loadTime: metrics.loadTime.toFixed(2) + 'ms',
        firstContentfulPaint: metrics.firstContentfulPaint.toFixed(2) + 'ms'
      });
    });
    
    // 交互响应时间
    document.addEventListener('click', e => {
      const startTime = performance.now();
      
      // 使用requestAnimationFrame检测下一帧渲染所需时间
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const endTime = performance.now();
          metrics.interactionTime = endTime - startTime;
          
          // 如果交互响应超过100ms，记录警告
          if (metrics.interactionTime > 100) {
            console.warn(`交互响应时间过长: ${metrics.interactionTime.toFixed(2)}ms`);
          }
        });
      });
    }, { passive: true, capture: true });
  }
  
  // 应用所有优化
  function applyAllOptimizations() {
    optimizeImageLoading();
    optimizeEventListeners();
    preloadCriticalResources();
    optimizeAnimations();
    monitorMemoryUsage();
    collectPerformanceMetrics();
  }
  
  // DOM加载完成后应用优化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllOptimizations);
  } else {
    applyAllOptimizations();
  }
  
  // 导出API
  window.yaYunPerformanceOptimizer = {
    getMetrics: () => ({ ...metrics }),
    optimizeImages: optimizeImageLoading,
    optimizeEvents: optimizeEventListeners,
    optimizeAnimations: optimizeAnimations,
    applyAll: applyAllOptimizations
  };
})(); 