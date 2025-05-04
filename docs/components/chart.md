# 动态折线图组件

## 组件概述

动态折线图组件是雅韵(YaYun)应用中用于数据可视化的重要元素，展示古典音乐播放量的时间趋势。该组件通过SVG技术实现，并使用CSS动画添加动态效果，以增强用户体验。

## 设计特点

1. **视觉设计**
   - 遵循应用整体设计语言，使用品牌主色 (#8B0000) 作为折线和数据点颜色
   - 采用卡片式设计，具有圆角和阴影效果，与应用其他组件保持一致性
   - 使用渐变填充区域，增强视觉层次感

2. **动画效果**
   - 折线绘制动画：使用 `stroke-dasharray` 和 `stroke-dashoffset` 实现渐进式绘制效果
   - 区域填充淡入：区域填充在折线绘制后平滑淡入
   - 数据点脉冲动画：数据点具有呼吸式缩放效果，增强互动感

3. **网格系统**
   - 水平网格线使用虚线和渐变效果，保持轻量感
   - 清晰标注时间轴（周一至周日）

## 技术实现

### SVG结构

```xml
<g class="chart-section" transform="translate(16, 295)">
  <!-- 卡片背景 -->
  <rect x="0" y="0" width="343" height="160" rx="16" fill="white" filter="url(#card-shadow)"/>
  
  <!-- 标题 -->
  <g transform="translate(16, 24)">
    <text font-family="'SF Pro Display'" font-size="16" font-weight="600" fill="#212121">古典音乐播放量趋势</text>
    <text y="20" font-family="'SF Pro Text'" font-size="12" fill="#757575">过去7天数据</text>
  </g>
  
  <!-- 图表区域 -->
  <g transform="translate(16, 60)">
    <!-- 水平网格线 -->
    <line x1="0" y1="0" x2="310" y2="0" stroke="url(#grid-gradient)" stroke-width="0.5" stroke-dasharray="2,2"/>
    <!-- 更多网格线... -->
    
    <!-- 日期标签 -->
    <text x="0" y="100" font-family="'SF Pro Text'" font-size="10" fill="#757575">周一</text>
    <!-- 更多日期标签... -->
    
    <!-- 数据折线 -->
    <polyline 
      class="chart-line"
      points="0,70 50,60 100,40 150,50 200,20 250,30 300,10" 
      fill="none" 
      stroke="#8B0000" 
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"/>
    
    <!-- 区域填充 -->
    <path 
      class="chart-area"
      d="M0,70 L50,60 L100,40 L150,50 L200,20 L250,30 L300,10 L300,80 L0,80 Z" 
      fill="url(#chart-gradient)"
      opacity="0.5"/>
    
    <!-- 数据点 -->
    <circle class="data-point" cx="0" cy="70" r="3" fill="#8B0000"/>
    <!-- 更多数据点... -->
  </g>
</g>
```

### CSS动画

```css
@keyframes dash {
  from {
    stroke-dashoffset: 500;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    r: 3;
    opacity: 0.3;
  }
  50% {
    r: 4;
    opacity: 1;
  }
  100% {
    r: 3;
    opacity: 0.3;
  }
}

.chart-line {
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: dash 3s ease-in-out forwards;
}

.chart-area {
  opacity: 0;
  animation: fade-in 2s ease-in-out 1s forwards;
}

.data-point {
  animation: pulse 2s infinite;
}
```

### 渐变定义

```xml
<!-- 折线图渐变 -->
<linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stop-color="#8B0000" stop-opacity="0.8"/>
  <stop offset="100%" stop-color="#8B0000" stop-opacity="0.1"/>
</linearGradient>

<!-- 折线图网格渐变 -->
<linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="#E0E0E0" stop-opacity="0.8"/>
  <stop offset="100%" stop-color="#E0E0E0" stop-opacity="0.2"/>
</linearGradient>
```

## 适配性与扩展

- 图表组件可根据不同数据集动态调整，只需修改polyline的points属性和对应的path路径
- 时间轴标签可根据需要更改为具体日期或其他时间单位
- 可扩展支持多条折线，用于比较不同类型的数据

## 交互考虑

在实际应用中，可以考虑添加以下交互功能：

- 悬停时显示具体数值的提示框
- 点击数据点展示该日详细收听数据
- 提供时间范围选择器（日/周/月/年）

## 无障碍性

- 为图表添加适当的ARIA属性，确保屏幕阅读器可以识别
- 提供数据表格版本作为图表的替代展示方式
- 确保颜色对比度符合WCAG 2.1 AA标准

## 性能优化

- 使用CSS动画而非JavaScript动画以减少性能开销
- SVG元素数量控制在合理范围内
- 路径点数量保持简洁，避免过度复杂的路径计算 