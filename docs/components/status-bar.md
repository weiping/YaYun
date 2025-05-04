# 雅韵(YaYun) - 状态栏组件说明文档

## 组件概述

状态栏组件是模拟iOS系统顶部状态栏的可复用组件，位于应用顶部，展示当前时间和系统状态信息（信号强度、WiFi连接、电池电量等）。组件支持深色/浅色两种模式，能够根据页面背景自动或手动切换显示状态。

## 组件结构

```html
<div class="status-bar flex items-center justify-between px-5 light" id="status-bar">
  <!-- 左侧时间 -->
  <div class="time text-sm font-semibold" id="status-time">9:41</div>
  
  <!-- 中间灵动岛区域 -->
  <div class="dynamic-island w-28 h-8 rounded-full bg-black absolute left-1/2 transform -translate-x-1/2 top-0"></div>
  
  <!-- 右侧状态图标 -->
  <div class="status-icons flex items-center space-x-1.5">
    <!-- 信号强度 -->
    <svg>...</svg>
    
    <!-- WiFi -->
    <svg>...</svg>
    
    <!-- 电池 -->
    <div class="battery flex items-center">...</div>
  </div>
</div>
```

## 视觉规格

- **高度**：44px（符合iOS标准状态栏高度）
- **字体**：SF Pro Display，12px，半粗体
- **灵动岛**：宽度114px，高度32px，圆角20px，黑色背景
- **背景**：透明（适配页面背景）
- **图标尺寸**：16px x 16px，统一线条粗细
- **文本颜色**：
  - 浅色模式：黑色(#000)
  - 深色模式：白色(#fff)

## 功能实现

### 时间显示

组件通过JavaScript实时更新当前时间，格式为"小时:分钟"（24小时制）：

```javascript
function updateStatusTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  // 格式化时间
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  document.getElementById('status-time').textContent = `${hours}:${minutes}`;
}

// 每分钟更新一次时间
setInterval(updateStatusTime, 60000);
```

### 深色/浅色模式切换

组件支持两种主题模式，可以通过添加/移除类名进行切换：

```javascript
function toggleTheme(isDark) {
  const statusBar = document.getElementById('status-bar');
  
  if (isDark) {
    statusBar.classList.remove('light');
    statusBar.classList.add('dark');
  } else {
    statusBar.classList.remove('dark');
    statusBar.classList.add('light');
  }
}
```

组件还可以自动检测系统颜色模式：

```javascript
// 检测是否为深色模式
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
toggleTheme(prefersDark);

// 监听系统颜色模式变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  toggleTheme(e.matches);
});
```

## 使用方法

### 基本引入

1. 将状态栏组件代码复制到页面顶部
2. 引入必要的CSS样式
3. 引入JavaScript以启用实时时间更新和主题切换功能

### 组件配置

可以通过修改以下属性定制状态栏：

- `id="status-bar"`：修改组件ID以避免冲突
- `class="light"` / `class="dark"`：设置初始主题模式
- 修改SVG图标可以更改状态图标样式

### 示例集成

```html
<!-- 页面头部 -->
<header>
  <!-- 状态栏组件 -->
  <div class="status-bar flex items-center justify-between px-5 light" id="status-bar">
    <!-- 组件内容... -->
  </div>
  
  <!-- 页面其他头部内容 -->
  <div class="app-header">
    <!-- ... -->
  </div>
</header>

<!-- 引入JavaScript -->
<script>
  // 状态栏初始化代码
  updateStatusTime();
  initStatusBar();
</script>
```

## 注意事项

1. **位置固定**：状态栏通常固定在页面顶部，需设置`position: fixed`和`z-index`确保正确显示
2. **响应式适配**：在小屏设备上可能需要调整内容显示
3. **灵动岛兼容**：只有iPhone 14 Pro及以上机型才有灵动岛，其他设备应显示传统刘海屏
4. **系统限制**：实际iOS应用中，状态栏由系统控制，本组件仅供模拟展示

## 兼容性

- 支持所有现代浏览器（Chrome、Safari、Firefox、Edge）
- 需要JavaScript启用才能正常工作
- 媒体查询`prefers-color-scheme`在较旧浏览器中不受支持

## 最佳实践

- 确保状态栏与页面内容不重叠，为其预留足够空间
- 考虑将状态栏包含在页面布局计算中，避免内容被遮挡
- 在页面切换时保持状态栏样式一致，避免闪烁
- 测试不同屏幕尺寸下状态栏的显示效果 