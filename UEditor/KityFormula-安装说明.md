# UEditor KityFormula 公式插件安装说明

## 1. 下载 KityFormula 插件

### 方式一：从 GitHub 下载
```bash
# 下载 KityFormula 插件
curl -L https://github.com/wjcgithub/kity-formula/archive/refs/heads/master.zip -o kity-formula.zip

# 解压
unzip kity-formula.zip
```

### 方式二：手动下载
访问：https://github.com/wjcgithub/kity-formula
点击 "Code" -> "Download ZIP"

## 2. 安装插件文件

将下载的文件放置到以下目录结构：

```
public/UEditor/third-party/kity-formula/
├── kity-formula-plugin.js          # 插件主文件
├── kityformula-editor.css          # 编辑器样式
├── kityformula.css                 # 公式样式
└── ...其他相关文件
```

## 3. 必需文件清单

- `kity-formula-plugin.js` - UEditor 插件接口
- `kityformula-editor.css` - 公式编辑器样式
- `kityformula.css` - 公式显示样式
- 其他依赖的 JS 和 CSS 文件

## 4. 验证安装

1. 启动开发服务器
2. 访问 UeditorView 页面
3. 点击工具栏的公式按钮（fx 图标）
4. 或点击顶部的"f(x) 插入公式"按钮

## 5. 如果没有 KityFormula 文件

可以使用简单的数学符号作为替代：
- 使用上标/下标按钮
- 使用插入特殊字符
- 或者考虑使用 MathJax/KaTeX 作为替代方案

## 6. 故障排查

如果公式功能无法使用：
1. 检查浏览器控制台是否有文件加载错误
2. 确认文件路径是否正确
3. 确认所有依赖文件都已正确放置
