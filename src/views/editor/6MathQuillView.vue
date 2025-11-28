<template>
  <div class="mathquill-container">
    <div class="header">
      <h2>富文本编辑器 (WangEditor + MathQuill)</h2>
      <p class="subtitle">集成 MathQuill 的交互式数学公式编辑能力</p>
      <div class="actions">
        <el-button type="primary" @click="getContent">获取内容</el-button>
        <el-button @click="setContent">设置示例</el-button>
        <el-button @click="clearContent">清空</el-button>
        <el-button type="success" @click="openFormulaDialog">
          <span style="font-size: 16px; font-weight: bold;">∑</span> 插入公式
        </el-button>
      </div>
    </div>

    <div class="editor-wrapper">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 300px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>

    <!-- MathQuill 公式对话框 -->
    <el-dialog v-model="formulaDialogVisible" title="插入数学公式 (MathQuill)" width="1000px" :close-on-click-modal="false">
      <div class="mathquill-dialog">
        <el-row :gutter="20">
          <el-col :span="14">
            <div class="editor-section">
              <h4>公式编辑器：</h4>
              <div ref="mathQuillEditorRef" class="mathquill-wrapper"></div>
              <div class="editor-tips">
                <p><strong>提示：</strong></p>
                <ul>
                  <li>点击编辑器开始输入数学公式</li>
                  <li>使用 Tab 键在占位符间切换</li>
                  <li>支持键盘输入 LaTeX 语法</li>
                </ul>
              </div>
            </div>

            <el-tabs v-model="activeTemplateTab" type="card" class="template-tabs">
              <el-tab-pane label="常用" name="common">
                <div class="template-section">
                  <el-button v-for="item in commonFormulas" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>

              <el-tab-pane label="呼吸生理学" name="respiratory">
                <div class="template-section">
                  <el-button v-for="item in respiratoryFormulas" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>

              <el-tab-pane label="医学" name="medical">
                <div class="template-section">
                  <el-button v-for="item in medicalFormulas" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>

              <el-tab-pane label="数学" name="math">
                <div class="template-section">
                  <el-button v-for="item in mathFormulas" :key="item.latex" size="small"
                    @click="setFormula(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>

          <el-col :span="10">
            <div class="output-section">
              <h4>LaTeX 代码：</h4>
              <el-input v-model="currentLatex" type="textarea" :rows="4" @input="updateMathQuill" />

              <h4 style="margin-top: 16px">渲染预览：</h4>
              <div class="render-preview">
                <div ref="previewRef" class="preview-math"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <el-button @click="formulaDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertFormula">确定插入</el-button>
      </template>
    </el-dialog>

    <div class="preview">
      <h3>内容预览：</h3>
      <el-card>
        <div ref="contentPreviewRef" v-html="previewContent"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, nextTick, onMounted } from 'vue'
// @ts-expect-error - wangeditor vue wrapper does not have type definitions
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
import formulaModule from '@wangeditor/plugin-formula'
import { ElMessage } from 'element-plus'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '@wangeditor/editor/dist/css/style.css'

// 注册公式插件
Boot.registerModule(formulaModule)

// MathQuill 类型声明
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MathQuill: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jQuery: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $: any
  }
}

// 编辑器实例
const editorRef = shallowRef()
const valueHtml = ref('<p>欢迎使用富文本编辑器！点击上方按钮插入 MathQuill 公式。</p>')
const previewContent = ref('')
const contentPreviewRef = ref<HTMLElement>()
const mode = ref('default')

// MathQuill 相关
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MQ = ref<any>(null)
const mathQuillEditorRef = ref<HTMLElement>()
const previewRef = ref<HTMLElement>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mathQuillInstance: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let previewInstance: any = null
const formulaDialogVisible = ref(false)
const currentLatex = ref('')
const activeTemplateTab = ref('common')

// 公式模板数据
const respiratoryFormulas = [
  { latex: '\\frac{\\dot{V}_A}{\\dot{Q}}', name: '通气血流比' },
  { latex: '\\dot{V}_A = 4.2\\text{ L/min}', name: '肺泡通气量' },
  { latex: '\\dot{Q} = 5.0\\text{ L/min}', name: '肺血流量' },
  { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} \\approx 0.8', name: '正常V̇A/Q̇比值' },
  { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} = 0', name: '分流状态' },
  { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} = \\infty', name: '死腔状态' },
  { latex: 'Q_s = 5.0\\text{ L/min}', name: '心输出量' },
  { latex: 'P_{O_2} = 40\\text{ mmHg}', name: '静脉血氧分压' },
  { latex: 'P_{CO_2}', name: '二氧化碳分压' }
]

const medicalFormulas = [
  { latex: '\\text{BMI} = \\frac{\\text{体重}}{\\text{身高}^2}', name: 'BMI指数' },
  { latex: '\\text{MAP} = \\text{DBP} + \\frac{1}{3}(\\text{SBP} - \\text{DBP})', name: '平均动脉压' },
  { latex: '\\text{CO} = \\text{HR} \\times \\text{SV}', name: '心输出量' }
]

const commonFormulas = [
  { latex: 'E = mc^2', name: '质能方程' },
  { latex: 'F = ma', name: '牛顿第二定律' },
  { latex: 'a^2 + b^2 = c^2', name: '勾股定理' }
]

const mathFormulas = [
  { latex: '\\frac{a}{b}', name: '分数' },
  { latex: '\\sqrt{x}', name: '平方根' },
  { latex: 'x^{n}', name: '幂' },
  { latex: '\\int_{a}^{b} f(x) dx', name: '定积分' },
  { latex: '\\sum_{i=1}^{n} x_i', name: '求和' }
]

// 工具栏配置
const toolbarConfig = {
  excludeKeys: []
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}

// 初始化 MathQuill
const initMathQuill = () => {
  return new Promise((resolve) => {
    if (window.MathQuill) {
      MQ.value = window.MathQuill.getInterface(2)
      resolve(true)
      return
    }

    // 加载 jQuery
    const jQueryScript = document.createElement('script')
    jQueryScript.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js'
    jQueryScript.onload = () => {
      // 加载 MathQuill CSS
      const mathQuillCSS = document.createElement('link')
      mathQuillCSS.rel = 'stylesheet'
      mathQuillCSS.href = 'https://cdn.bootcdn.net/ajax/libs/mathquill/0.10.1/mathquill.min.css'
      document.head.appendChild(mathQuillCSS)

      // 加载 MathQuill JS
      const mathQuillScript = document.createElement('script')
      mathQuillScript.src = 'https://cdn.bootcdn.net/ajax/libs/mathquill/0.10.1/mathquill.min.js'
      mathQuillScript.onload = () => {
        MQ.value = window.MathQuill.getInterface(2)
        ElMessage.success('MathQuill 加载成功')
        resolve(true)
      }
      document.body.appendChild(mathQuillScript)
    }
    document.body.appendChild(jQueryScript)
  })
}

// 初始化编辑器实例
const initMathQuillEditor = () => {
  if (!mathQuillEditorRef.value || !MQ.value) return

  mathQuillEditorRef.value.innerHTML = ''
  mathQuillInstance = MQ.value.MathField(mathQuillEditorRef.value, {
    spaceBehavesLikeTab: true,
    handlers: {
      edit: () => {
        if (mathQuillInstance) {
          currentLatex.value = mathQuillInstance.latex()
          updatePreview()
        }
      }
    }
  })

  // 设置初始值
  mathQuillInstance.latex('f(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{x^2}{2}}')
  currentLatex.value = mathQuillInstance.latex()
  updatePreview()
}

// 初始化预览
const initPreview = () => {
  if (!previewRef.value || !MQ.value) return

  previewRef.value.innerHTML = ''
  previewInstance = MQ.value.StaticMath(previewRef.value)
}

// 更新预览
const updatePreview = () => {
  if (previewInstance && currentLatex.value) {
    previewInstance.latex(currentLatex.value)
  }
}

// 从 LaTeX 输入更新编辑器
const updateMathQuill = () => {
  if (mathQuillInstance) {
    mathQuillInstance.latex(currentLatex.value)
  }
  updatePreview()
}

// 设置公式
const setFormula = (latex: string) => {
  if (mathQuillInstance) {
    mathQuillInstance.latex(latex)
    currentLatex.value = latex
    mathQuillInstance.focus()
    updatePreview()
  }
}

// 打开公式对话框
const openFormulaDialog = () => {
  formulaDialogVisible.value = true
  nextTick(() => {
    if (!mathQuillInstance) {
      initMathQuillEditor()
      initPreview()
    }
  })
}

// 确认插入公式
const confirmInsertFormula = () => {
  if (!currentLatex.value.trim()) {
    ElMessage.warning('请输入公式')
    return
  }

  const editor = editorRef.value
  if (!editor) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorInstance = editor as any

    const formulaNode = {
      type: 'formula',
      value: currentLatex.value,
      children: [{ text: '' }]
    }

    editorInstance.insertNode(formulaNode)

    formulaDialogVisible.value = false
    ElMessage.success('公式已插入')
  } catch (error) {
    console.error('插入公式失败:', error)
    ElMessage.error('插入失败，请重试')
  }
}

// 编辑器创建完成
const handleCreated = (editor: unknown) => {
  editorRef.value = editor
  ElMessage.success('编辑器加载完成')
}

// 渲染预览区域的公式
const renderPreviewFormulas = () => {
  if (!contentPreviewRef.value) return

  nextTick(() => {
    try {
      // 找到所有公式元素
      const formulas = contentPreviewRef.value!.querySelectorAll('span[data-w-e-type="formula"]')

      formulas.forEach((span: Element) => {
        const value = span.getAttribute('data-value')
        if (!value) return

        try {
          // 使用 KaTeX 渲染公式
          katex.render(value, span as HTMLElement, {
            throwOnError: false,
            displayMode: !span.hasAttribute('data-w-e-is-inline')
          })
        } catch (err) {
          console.error('公式渲染错误:', err, '公式:', value)
          // 如果渲染失败，至少显示原始公式
          span.textContent = value
        }
      })
    } catch (error) {
      console.error('公式渲染过程出错:', error)
    }
  })
}

// 获取内容
const getContent = () => {
  previewContent.value = valueHtml.value
  renderPreviewFormulas()
  ElMessage.success('内容已更新到预览区域')
  console.log('编辑器内容：', valueHtml.value)
}

// 设置内容
const setContent = () => {
  const sampleContent = `
    <h2>这是一个示例标题</h2>
    <p>这是一段示例文本，展示了富文本编辑器的基本功能。</p>
    <p>数学公式示例：<span data-w-e-type="formula" data-w-e-is-void data-w-e-is-inline data-value="E=mc^2"></span></p>
    <p>通气血流比：<span data-w-e-type="formula" data-w-e-is-void data-w-e-is-inline data-value="\\frac{\\dot{V}_A}{\\dot{Q}} \\approx 0.8"></span></p>
  `
  valueHtml.value = sampleContent
  previewContent.value = sampleContent
  renderPreviewFormulas()
  ElMessage.success('已设置示例内容')
}

// 清空内容
const clearContent = () => {
  valueHtml.value = ''
  previewContent.value = ''
  ElMessage.info('内容已清空')
}

// 组件挂载
onMounted(async () => {
  await initMathQuill()
})

// 组件销毁
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ; (editor as any).destroy()

  mathQuillInstance = null
  previewInstance = null
})
</script>

<style lang="scss" scoped>
.mathquill-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  h2 {
    margin: 0 0 8px 0;
    color: #303133;
    font-size: 24px;
  }

  .subtitle {
    margin: 0 0 16px 0;
    color: #606266;
    font-size: 14px;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.editor-wrapper {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.preview {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  h3 {
    margin: 0 0 15px 0;
    color: #303133;
    font-size: 18px;
  }

  :deep(.el-card__body) {
    min-height: 200px;

    p {
      margin: 8px 0;
      line-height: 1.8;
    }
  }
}

.mathquill-dialog {
  .editor-section {
    margin-bottom: 20px;

    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 15px;
      font-weight: 600;
    }

    .mathquill-wrapper {
      min-height: 100px;
      padding: 16px;
      background: #f5f7fa;
      border: 2px solid #409eff;
      border-radius: 8px;
      font-size: 24px;
      margin-bottom: 12px;
    }

    .editor-tips {
      padding: 12px;
      background: #f0f9ff;
      border-radius: 6px;
      border-left: 4px solid #409eff;

      p {
        margin: 0 0 8px 0;
        color: #303133;
        font-weight: 600;
        font-size: 13px;
      }

      ul {
        margin: 0;
        padding-left: 20px;

        li {
          margin: 4px 0;
          color: #606266;
          font-size: 12px;
        }
      }
    }
  }

  .template-tabs {
    :deep(.el-tabs__content) {
      max-height: 200px;
      overflow-y: auto;
    }

    .template-section {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;

      .el-button {
        font-size: 12px;
      }
    }
  }

  .output-section {
    h4 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 14px;
      font-weight: 600;
    }

    .render-preview {
      padding: 16px;
      background: #f8f9fa;
      border: 2px dashed #ddd;
      border-radius: 6px;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;

      .preview-math {
        font-size: 20px;
      }
    }
  }
}

// MathQuill 样式
:deep(.mq-editable-field) {
  border: none !important;
}

@media (max-width: 768px) {
  .header {
    h2 {
      font-size: 20px;
    }

    .actions {
      flex-direction: column;
    }
  }
}
</style>
