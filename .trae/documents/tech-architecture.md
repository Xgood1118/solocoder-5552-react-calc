## 1. 架构设计

```mermaid
flowchart TB
    "UI层" --> "状态管理层"
    "状态管理层" --> "计算引擎层"
    "计算引擎层" --> "数值精度层"
    
    subgraph "UI层"
        "CalculatorKeyboard"
        "ExpressionInput"
        "ResultDisplay"
        "MatrixEditor"
        "UnitConverter"
        "HistoryPanel"
    end
    
    subgraph "状态管理层"
        "Zustand Store"
        "i18n Store"
        "Theme Store"
    end
    
    subgraph "计算引擎层"
        "ExpressionParser"
        "ComplexEngine"
        "MatrixEngine"
        "UnitConverterEngine"
        "BaseConverterEngine"
    end
    
    subgraph "数值精度层"
        "bignumber.js"
    end
```

## 2. 技术说明
- 前端：React@18 + TypeScript + Tailwind CSS@3 + Vite
- 初始化工具：vite-init（react-ts 模板）
- 状态管理：Zustand
- 数值精度：bignumber.js
- 国际化：react-i18next + i18next
- 路由：react-router-dom（单页多标签模式）
- 图标：lucide-react
- 离线支持：Vite PWA 插件（vite-plugin-pwa）
- 后端：无（纯前端）
- 数据库：无（localStorage 持久化）

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| / | 主计算页面（基础运算 + 复数运算） |
| /matrix | 矩阵运算页面 |
| /converter | 单位换算 + 进制互转页面 |

注：主计算页通过标签切换基础/复数模式，矩阵和换算为独立页面，通过顶部导航切换。

## 4. 项目目录结构

```
src/
├── components/
│   ├── calculator/
│   │   ├── ExpressionInput.tsx      # 表达式输入组件
│   │   ├── ResultDisplay.tsx        # 结果显示组件
│   │   ├── ScientificKeyboard.tsx   # 科学计算键盘
│   │   ├── ComplexKeyboard.tsx      # 复数运算键盘
│   │   └── ModeSwitch.tsx           # 基础/复数模式切换
│   ├── matrix/
│   │   ├── MatrixEditor.tsx         # 矩阵可视化编辑器
│   │   ├── MatrixOperations.tsx     # 矩阵操作面板
│   │   └── MatrixResult.tsx         # 矩阵结果展示
│   ├── converter/
│   │   ├── UnitConverter.tsx        # 单位换算组件
│   │   ├── BaseConverter.tsx        # 进制互转组件
│   │   └── UnitCategoryTabs.tsx     # 单位类别标签
│   ├── history/
│   │   ├── HistoryList.tsx          # 历史记录列表
│   │   ├── FormulaPresets.tsx       # 公式收藏预设
│   │   └── VariableManager.tsx      # 变量管理
│   ├── layout/
│   │   ├── AppLayout.tsx            # 应用整体布局
│   │   ├── Navigation.tsx           # 顶部导航
│   │   └── ThemeSwitcher.tsx        # 主题切换器
│   └── common/
│       ├── KeyboardKey.tsx          # 单个按键组件
│       └── DisplayPanel.tsx         # 显示面板组件
├── engine/
│   ├── parser.ts                    # 表达式词法/语法分析器
│   ├── evaluator.ts                 # 表达式求值器
│   ├── complex.ts                   # 复数运算引擎
│   ├── matrix.ts                    # 矩阵运算引擎（含LU/QR/Jacobi）
│   ├── units.ts                     # 单位换算引擎
│   ├── base.ts                      # 进制互转引擎
│   ├── constants.ts                 # 数学/物理常量定义
│   └── errors.ts                    # 错误定义与友好提示
├── hooks/
│   ├── useCalculator.ts             # 计算器核心逻辑hook
│   ├── useComplex.ts                # 复数计算hook
│   ├── useMatrix.ts                 # 矩阵计算hook
│   ├── useConverter.ts              # 换算逻辑hook
│   └── useTheme.ts                  # 主题hook
├── store/
│   ├── calculatorStore.ts           # 计算器状态（表达式、结果、历史）
│   ├── variableStore.ts             # 用户变量状态（localStorage持久化）
│   └── settingsStore.ts             # 设置状态（主题、语言、角度制）
├── i18n/
│   ├── index.ts                     # i18next 初始化
│   ├── zh.json                      # 中文翻译
│   └── en.json                      # 英文翻译
├── pages/
│   ├── CalculatorPage.tsx           # 主计算页
│   ├── MatrixPage.tsx               # 矩阵运算页
│   └── ConverterPage.tsx            # 单位换算页
├── types/
│   ├── calculator.ts                # 计算器类型定义
│   ├── complex.ts                   # 复数类型定义
│   ├── matrix.ts                    # 矩阵类型定义
│   └── units.ts                     # 单位类型定义
├── App.tsx
├── main.tsx
└── index.css                        # 全局样式 + CSS变量（主题）
```

## 5. 核心引擎设计

### 5.1 表达式解析器（parser.ts）
- 采用递归下降解析器（Recursive Descent Parser）
- 支持运算符优先级：括号 > 函数调用 > 幂运算 > 一元正负 > 乘除模 > 加减
- 支持 C(n,k)、P(n,k) 函数语法
- 支持变量替换（用户定义的变量 A, B, C...）
- 支持 Ans 关键字（上次计算结果）
- 支持复数表达式（识别 i 为虚数单位）

### 5.2 复数引擎（complex.ts）
- 内部表示：`{ re: BigNumber, im: BigNumber }`
- 加减乘除：标准复数运算公式
- 模：`sqrt(re² + im²)`
- 辐角：`atan2(im, re)`
- 共轭：`re - im*i`
- 显示格式：`a+bi`（自动简化，如 `3+i` 而非 `3+1i`）

### 5.3 矩阵引擎（matrix.ts）
- 内部表示：`BigNumber[][]`
- 加减：逐元素运算
- 乘法：标准矩阵乘法
- 转置：行列互换
- 求逆：高斯-约旦消元法
- 行列式：LU分解法
- 特征值：Jacobi 迭代法（对称矩阵）+ QR 算法（一般矩阵）
- LU分解：Doolittle 算法
- QR分解：Gram-Schmidt 正交化

### 5.4 单位换算引擎（units.ts）
- 每类单位定义基准单位，所有换算先转到基准再转目标
- 温度类特殊处理：非线性换算公式
- 数据存储：区分二进制（1024）和十进制（1000）前缀

### 5.5 进制互转引擎（base.ts）
- 支持小数部分的进制转换
- 整数部分：除基取余法
- 小数部分：乘基取整法
- 精度控制：小数部分最多 20 位

## 6. 数据持久化

| 数据类型 | 存储方式 | 键名 |
|----------|----------|------|
| 计算历史 | localStorage | `calc_history` |
| 用户变量 | localStorage | `calc_variables` |
| 公式收藏 | localStorage | `calc_presets` |
| 主题设置 | localStorage | `calc_theme` |
| 语言设置 | localStorage | `calc_lang` |
| 角度制设置 | localStorage | `calc_angle_mode` |
