<template>
  <div class="ueditor-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>正在初始化 KaTeX 编辑器...</p>
      </div>
    </div>

    <!-- 主内容 -->
    <div v-else class="main-content">
      <div class="header">
        <h2>富文本编辑器 (wangeditor + KaTeX)</h2>
        <div class="actions">
          <el-button type="primary" @click="getContent">获取内容</el-button>
          <el-button @click="setContent">设置内容</el-button>
          <el-button @click="clearContent">清空</el-button>
          <el-button @click="getHtml">获取 HTML</el-button>
          <el-button type="success" @click="openFormulaDialog">
            <span style="font-size: 16px; font-weight: bold;">f(x)</span> 插入公式
          </el-button>
        </div>
      </div>

      <div class="editor-wrapper">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
          :mode="mode" />
        <Editor style="height: 300px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
          :mode="mode" @onCreated="handleCreated" />
      </div>
      <!-- 自定义公式选择对话框 -->
      <el-dialog v-model="formulaDialogVisible" :title="isSimpleMode ? '插入公式' : '编辑公式'" width="900px"
        :close-on-click-modal="false">
        <div class="formula-dialog">
          <!-- 简单模式：仅显示自定义输入 -->
          <div v-if="isSimpleMode">
            <el-input v-model="customFormula" type="textarea" :rows="4" placeholder="输入 LaTeX 格式的公式，例如：E=mc^2" />
            <div class="formula-preview" v-if="customFormula">
              <h4>预览：</h4>
              <div ref="customPreviewRef" class="preview-content"></div>
            </div>
          </div>

          <!-- 完整模式：显示分类选择和自定义输入 -->
          <el-tabs v-else v-model="activeFormulaTab" type="card">
            <!-- 数学公式 -->
            <el-tab-pane label="数学公式" name="math">
              <div class="formula-category">
                <h4>基础运算</h4>
                <div class="formula-list">
                  <el-button v-for="item in mathFormulas.basic" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>希腊字母</h4>
                <div class="formula-list">
                  <el-button v-for="item in mathFormulas.greek" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>上下标与根式</h4>
                <div class="formula-list">
                  <el-button v-for="item in mathFormulas.scripts" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>积分微分</h4>
                <div class="formula-list">
                  <el-button v-for="item in mathFormulas.calculus" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>矩阵与向量</h4>
                <div class="formula-list">
                  <el-button v-for="item in mathFormulas.matrix" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 化学公式 -->
            <el-tab-pane label="化学公式" name="chemistry">
              <div class="formula-category">
                <h4>常见分子</h4>
                <div class="formula-list">
                  <el-button v-for="item in chemistryFormulas.molecules" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>化学反应</h4>
                <div class="formula-list">
                  <el-button v-for="item in chemistryFormulas.reactions" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>离子与电荷</h4>
                <div class="formula-list">
                  <el-button v-for="item in chemistryFormulas.ions" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>化学符号</h4>
                <div class="formula-list">
                  <el-button v-for="item in chemistryFormulas.symbols" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 物理公式 -->
            <el-tab-pane label="物理公式" name="physics">
              <div class="formula-category">
                <h4>经典力学</h4>
                <div class="formula-list">
                  <el-button v-for="item in physicsFormulas.mechanics" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>电磁学</h4>
                <div class="formula-list">
                  <el-button v-for="item in physicsFormulas.electromagnetism" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>热力学</h4>
                <div class="formula-list">
                  <el-button v-for="item in physicsFormulas.thermodynamics" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 医学公式 -->
            <el-tab-pane label="医学公式" name="medical">
              <div class="formula-category">
                <h4>体格测量</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.bmi" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>药物剂量</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.dosage" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>心血管</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.cardiovascular" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>肾脏功能</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.renal" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>呼吸系统</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.respiratory" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>实验室检查</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.laboratory" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>儿科</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.pediatric" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
              <div class="formula-category">
                <h4>临床评分</h4>
                <div class="formula-list">
                  <el-button v-for="item in medicalFormulas.clinical" :key="item.latex" size="small"
                    @click="insertFormulaTemplate(item.latex)">
                    {{ item.name }}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 自定义输入 -->
            <el-tab-pane label="自定义输入" name="custom">
              <el-input v-model="customFormula" type="textarea" :rows="4" placeholder="输入 LaTeX 格式的公式，例如：E=mc^2" />
              <div class="preview-controls">
                <el-button type="primary" :disabled="!customFormula" @click="togglePreview">
                  {{ showCustomPreview ? '隐藏预览' : '显示预览' }}
                </el-button>
              </div>
              <div class="formula-preview" v-if="showCustomPreview && customFormula">
                <h4>预览效果：</h4>
                <div ref="customPreviewRef" class="preview-content"></div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template #footer>
          <el-button @click="formulaDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInsertFormula">确定插入</el-button>
        </template>
      </el-dialog>

      <div class="preview">
        <h3>内容预览：</h3>
        <el-card>
          <div v-html="previewContent"></div>
        </el-card>
      </div>
    </div> <!-- 关闭 main-content -->
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, onBeforeUnmount, onMounted, nextTick, watch } from 'vue'
// @ts-expect-error - wangeditor vue wrapper does not have type definitions
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
import formulaModule from '@wangeditor/plugin-formula'
import { ElMessage } from 'element-plus'
import katex from 'katex'
import '@wangeditor/editor/dist/css/style.css'
import 'katex/dist/katex.min.css'

// 注册公式插件
Boot.registerModule(formulaModule)

// 加载状态
const isLoading = ref(true)

// 编辑器实例
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>欢迎使用富文本编辑器！</p>')
const previewContent = ref('')

// 模式
const mode = ref('default')

// 公式对话框状态
const formulaDialogVisible = ref(false)
const isSimpleMode = ref(true) // true: 插入公式(简单模式), false: 编辑公式(完整模式)
const activeFormulaTab = ref('math')
const customFormula = ref('')
const customPreviewRef = ref<HTMLElement>()
const showCustomPreview = ref(false) // 控制自定义公式预览显示

// 数学公式模板
const mathFormulas = {
  basic: [
    { latex: '\\frac{a}{b}', name: '分数 a/b' },
    { latex: '\\sqrt{x}', name: '平方根 √x' },
    { latex: '\\sqrt[n]{x}', name: 'n次根 ⁿ√x' },
    { latex: 'x^{n}', name: '幂 xⁿ' },
    { latex: 'x_{n}', name: '下标 xₙ' },
    { latex: '\\pm', name: '正负 ±' },
    { latex: '\\times', name: '乘 ×' },
    { latex: '\\div', name: '除 ÷' },
    { latex: '\\neq', name: '不等 ≠' },
    { latex: '\\leq', name: '小于等于 ≤' },
    { latex: '\\geq', name: '大于等于 ≥' },
    { latex: '\\approx', name: '约等于 ≈' },
    { latex: '\\infty', name: '无穷 ∞' },
    { latex: '\\propto', name: '正比 ∝' }
  ],
  greek: [
    { latex: '\\alpha', name: 'α (alpha)' },
    { latex: '\\beta', name: 'β (beta)' },
    { latex: '\\gamma', name: 'γ (gamma)' },
    { latex: '\\delta', name: 'δ (delta)' },
    { latex: '\\epsilon', name: 'ε (epsilon)' },
    { latex: '\\theta', name: 'θ (theta)' },
    { latex: '\\lambda', name: 'λ (lambda)' },
    { latex: '\\mu', name: 'μ (mu)' },
    { latex: '\\pi', name: 'π (pi)' },
    { latex: '\\rho', name: 'ρ (rho)' },
    { latex: '\\sigma', name: 'σ (sigma)' },
    { latex: '\\phi', name: 'φ (phi)' },
    { latex: '\\omega', name: 'ω (omega)' },
    { latex: '\\Omega', name: 'Ω (Omega大写)' }
  ],
  scripts: [
    { latex: 'a^2 + b^2 = c^2', name: '勾股定理' },
    { latex: 'x^{a+b}', name: '复杂上标' },
    { latex: 'a_1, a_2, \\ldots, a_n', name: '数列' },
    { latex: 'x_{i,j}', name: '双下标' },
    { latex: '\\sqrt{a^2 + b^2}', name: '根号组合' }
  ],
  calculus: [
    { latex: '\\int_{a}^{b} f(x) dx', name: '定积分' },
    { latex: '\\sum_{i=1}^{n} x_i', name: '求和 Σ' },
    { latex: '\\prod_{i=1}^{n} x_i', name: '连乘 ∏' },
    { latex: '\\lim_{x \\to \\infty} f(x)', name: '极限' },
    { latex: '\\frac{dy}{dx}', name: '导数' },
    { latex: '\\frac{\\partial f}{\\partial x}', name: '偏导数' },
    { latex: '\\oint', name: '环路积分' },
    { latex: '\\nabla', name: '梯度 ∇' }
  ],
  matrix: [
    { latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', name: '2×2矩阵' },
    { latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', name: '2×2方括号矩阵' },
    { latex: '\\vec{a}', name: '向量' },
    { latex: '\\hat{a}', name: '单位向量' },
    { latex: '\\overrightarrow{AB}', name: '箭头向量' }
  ]
}

// 化学公式模板
const chemistryFormulas = {
  molecules: [
    { latex: '\\text{H}_2\\text{O}', name: 'H₂O 水' },
    { latex: '\\text{CO}_2', name: 'CO₂ 二氧化碳' },
    { latex: '\\text{NH}_3', name: 'NH₃ 氨气' },
    { latex: '\\text{H}_2\\text{SO}_4', name: 'H₂SO₄ 硫酸' },
    { latex: '\\text{NaCl}', name: 'NaCl 氯化钠' },
    { latex: '\\text{C}_6\\text{H}_{12}\\text{O}_6', name: 'C₆H₁₂O₆ 葡萄糖' },
    { latex: '\\text{CH}_4', name: 'CH₄ 甲烷' },
    { latex: '\\text{O}_2', name: 'O₂ 氧气' },
    { latex: '\\text{N}_2', name: 'N₂ 氮气' },
    { latex: '\\text{HNO}_3', name: 'HNO₃ 硝酸' },
    { latex: '\\text{NaOH}', name: 'NaOH 氢氧化钠' },
    { latex: '\\text{CaCO}_3', name: 'CaCO₃ 碳酸钙' }
  ],
  reactions: [
    { latex: '\\text{2H}_2 + \\text{O}_2 \\rightarrow \\text{2H}_2\\text{O}', name: '燃烧反应' },
    { latex: '\\text{A} + \\text{B} \\leftrightharpoons \\text{C} + \\text{D}', name: '可逆反应' },
    { latex: '\\text{A} \\xrightarrow{\\text{H}^+} \\text{B}', name: '催化反应' },
    { latex: '\\text{A} \\xrightarrow[\\text{条件}]{\\text{催化剂}} \\text{B}', name: '条件反应' },
    { latex: '\\text{A} + \\text{B} \\rightleftharpoons \\text{C}', name: '平衡反应' }
  ],
  ions: [
    { latex: '\\text{Fe}^{2+}', name: 'Fe²⁺ 亚铁离子' },
    { latex: '\\text{Fe}^{3+}', name: 'Fe³⁺ 铁离子' },
    { latex: '\\text{Cu}^{2+}', name: 'Cu²⁺ 铜离子' },
    { latex: '\\text{SO}_4^{2-}', name: 'SO₄²⁻ 硫酸根' },
    { latex: '\\text{OH}^{-}', name: 'OH⁻ 氢氧根' },
    { latex: '\\text{Cl}^{-}', name: 'Cl⁻ 氯离子' },
    { latex: '\\text{H}^{+}', name: 'H⁺ 氢离子' },
    { latex: '\\text{NH}_4^{+}', name: 'NH₄⁺ 铵根' }
  ],
  symbols: [
    { latex: '\\uparrow', name: '↑ 气体逸出' },
    { latex: '\\downarrow', name: '↓ 沉淀生成' },
    { latex: '\\triangle', name: 'Δ 加热' },
    { latex: '\\rightleftharpoons', name: '⇌ 可逆' },
    { latex: '\\xrightarrow{\\text{光照}}', name: '光照条件' },
    { latex: '\\xrightarrow{\\text{加热}}', name: '加热条件' }
  ]
}

// 物理公式模板
const physicsFormulas = {
  mechanics: [
    { latex: 'F = ma', name: '牛顿第二定律' },
    { latex: 'E_k = \\frac{1}{2}mv^2', name: '动能' },
    { latex: 'E_p = mgh', name: '重力势能' },
    { latex: 'p = mv', name: '动量' },
    { latex: 'W = Fs\\cos\\theta', name: '功' },
    { latex: 'v = v_0 + at', name: '匀变速直线运动' },
    { latex: 's = v_0 t + \\frac{1}{2}at^2', name: '位移公式' },
    { latex: 'v^2 - v_0^2 = 2as', name: '速度位移关系' }
  ],
  electromagnetism: [
    { latex: 'E = mc^2', name: '质能方程' },
    { latex: 'F = qE', name: '电场力' },
    { latex: 'F = qvB', name: '洛伦兹力' },
    { latex: 'U = IR', name: '欧姆定律' },
    { latex: 'P = UI', name: '电功率' },
    { latex: 'W = UIt', name: '电功' },
    { latex: 'E = \\frac{F}{q}', name: '电场强度' },
    { latex: '\\Phi = BS', name: '磁通量' }
  ],
  thermodynamics: [
    { latex: 'PV = nRT', name: '理想气体状态方程' },
    { latex: 'Q = cm\\Delta T', name: '热量' },
    { latex: '\\Delta U = Q - W', name: '热力学第一定律' },
    { latex: 'W = P\\Delta V', name: '气体做功' },
    { latex: 'C_p - C_v = R', name: '迈耶公式' }
  ]
}

// 医学公式模板
const medicalFormulas = {
  bmi: [
    { latex: '\\text{BMI} = \\frac{\\text{体重(kg)}}{\\text{身高}^2(m^2)}', name: 'BMI 体重指数' },
    { latex: '\\text{BSA} = \\sqrt{\\frac{\\text{身高(cm)} \\times \\text{体重(kg)}}{3600}}', name: 'BSA 体表面积(Mosteller)' },
    { latex: '\\text{IBW}_\\text{男} = 50 + 2.3 \\times (\\text{身高(英寸)} - 60)', name: '理想体重(男)' },
    { latex: '\\text{IBW}_\\text{女} = 45.5 + 2.3 \\times (\\text{身高(英寸)} - 60)', name: '理想体重(女)' },
    { latex: '\\text{ABW} = \\text{IBW} + 0.4 \\times (\\text{实际体重} - \\text{IBW})', name: '调整体重' },
    { latex: '\\text{LBM}_\\text{男} = 1.1 \\times \\text{体重} - 128 \\times \\frac{\\text{体重}^2}{\\text{身高}^2}', name: '瘦体重(男)' }
  ],
  dosage: [
    { latex: '\\text{剂量} = \\frac{\\text{体重(kg)} \\times \\text{单位剂量(mg/kg)}}{1}', name: '体重剂量计算' },
    { latex: '\\text{滴速} = \\frac{\\text{液体总量(ml)} \\times \\text{滴系数}}{\\text{时间(min)}}', name: '静脉滴注速度' },
    { latex: '\\text{儿童剂量} = \\text{成人剂量} \\times \\frac{\\text{体重(kg)}}{70}', name: '儿童剂量(体重法)' },
    { latex: '\\text{儿童剂量} = \\text{成人剂量} \\times \\frac{\\text{年龄}}{\\text{年龄} + 12}', name: '儿童剂量(Young公式)' },
    { latex: '\\text{泵速}(ml/h) = \\frac{\\text{剂量}(\\mu g/kg/min) \\times \\text{体重}(kg) \\times 60}{\\text{浓度}(\\mu g/ml)}', name: '微量泵速度' },
    { latex: '\\text{肾功调整剂量} = \\text{正常剂量} \\times \\frac{\\text{CCr}_\\text{患者}}{\\text{CCr}_\\text{正常}}', name: '肾功能调整剂量' }
  ],
  cardiovascular: [
    { latex: '\\text{MAP} = \\text{DBP} + \\frac{1}{3}(\\text{SBP} - \\text{DBP})', name: '平均动脉压' },
    { latex: '\\text{CO} = \\text{HR} \\times \\text{SV}', name: '心输出量' },
    { latex: '\\text{CI} = \\frac{\\text{CO}}{\\text{BSA}}', name: '心脏指数' },
    { latex: '\\text{EF}(\\%) = \\frac{\\text{SV}}{\\text{EDV}} \\times 100', name: '射血分数' },
    { latex: '\\text{SVR} = \\frac{(\\text{MAP} - \\text{CVP}) \\times 80}{\\text{CO}}', name: '体循环阻力' },
    { latex: '\\text{QTc}_\\text{Bazett} = \\frac{\\text{QT}}{\\sqrt{\\text{RR}}}', name: 'QTc校正(Bazett)' },
    { latex: '\\text{心率} = \\frac{60}{\\text{RR间期(秒)}}', name: '心率计算' },
    { latex: '\\text{PP} = \\text{SBP} - \\text{DBP}', name: '脉压差' }
  ],
  renal: [
    { latex: '\\text{CCr} = \\frac{\\text{尿肌酐} \\times \\text{尿量}}{\\text{血肌酐} \\times \\text{时间}}', name: '肌酐清除率' },
    { latex: '\\text{eGFR} = 186 \\times \\text{SCr}^{-1.154} \\times \\text{年龄}^{-0.203}', name: 'eGFR(MDRD)' },
    { latex: '\\text{CCr} = \\frac{(140 - \\text{年龄}) \\times \\text{体重}}{72 \\times \\text{SCr}} \\times 0.85_\\text{女}', name: 'Cockcroft-Gault公式' },
    { latex: '\\text{FENa}(\\%) = \\frac{\\text{尿钠} \\times \\text{血肌酐}}{\\text{血钠} \\times \\text{尿肌酐}} \\times 100', name: '钠排泄分数' },
    { latex: '\\text{尿渗透压} = 2(\\text{Na}^+ + \\text{K}^+) + \\frac{\\text{尿素}}{2.8} + \\frac{\\text{葡萄糖}}{18}', name: '尿渗透压' },
    { latex: '\\text{每日尿蛋白} = \\frac{\\text{尿蛋白浓度} \\times \\text{24h尿量}}{1000}', name: '24小时尿蛋白' }
  ],
  respiratory: [
    { latex: '\\\\frac{\\\\dot{V}_A}{\\\\dot{Q}}', name: '通气血流比' },
    { latex: '\\\\dot{V}_A = 4.2\\\\text{ L/min}', name: '肺泡通气量' },
    { latex: '\\\\dot{Q} = 5.0\\\\text{ L/min}', name: '肺血流量' },
    { latex: '\\\\frac{\\\\dot{V}_A}{\\\\dot{Q}} \\\\approx 0.8', name: '正常V̇A/Q̇比值' },
    { latex: '\\\\frac{\\\\dot{V}_A}{\\\\dot{Q}} = 0', name: '分流状态' },
    { latex: '\\\\frac{\\\\dot{V}_A}{\\\\dot{Q}} = \\\\infty', name: '死腔状态' },
    { latex: 'Q_s = 5.0\\\\text{ L/min}', name: '心输出量' },
    { latex: 'P_{O_2} = 40\\\\text{ mmHg}', name: '静脉血氧分压' },
    { latex: 'P_{CO_2}', name: '二氧化碳分压' },
    { latex: '\\\\text{A-a梯度} = (\\\\text{FiO}_2 \\\\times (P_{\\\\text{atm}} - 47) - \\\\frac{\\\\text{PaCO}_2}{0.8}) - \\\\text{PaO}_2', name: 'A-a氧梯度' },
    { latex: '\\\\text{PaO}_2/\\\\text{FiO}_2', name: 'P/F比值' },
    { latex: '\\\\text{肺泡气公式}: P_A\\\\text{O}_2 = \\\\text{FiO}_2 \\\\times (P_{\\\\text{atm}} - 47) - \\\\frac{\\\\text{PaCO}_2}{R}', name: '肺泡气氧分压' },
    { latex: '\\\\text{VT} = 6-8 \\\\text{ml/kg IBW}', name: '潮气量' },
    { latex: '\\\\text{MV} = \\\\text{VT} \\\\times \\\\text{RR}', name: '分钟通气量' },
    { latex: '\\\\text{死腔通气比} = \\\\frac{V_D}{V_T} = \\\\frac{\\\\text{PaCO}_2 - \\\\text{ETCO}_2}{\\\\text{PaCO}_2}', name: '死腔/潮气量比' },
    { latex: '\\\\text{氧含量} = (1.34 \\\\times \\\\text{Hb} \\\\times \\\\text{SaO}_2) + (0.003 \\\\times \\\\text{PaO}_2)', name: '动脉氧含量' }
  ],
  laboratory: [
    { latex: '\\text{AG} = \\text{Na}^+ - (\\text{Cl}^- + \\text{HCO}_3^-)', name: '阴离子间隙' },
    { latex: '\\text{校正钙} = \\text{测定钙} + 0.8 \\times (4 - \\text{白蛋白})', name: '校正血钙' },
    { latex: '\\text{血清渗透压} = 2 \\times \\text{Na}^+ + \\frac{\\text{葡萄糖}}{18} + \\frac{\\text{BUN}}{2.8}', name: '血清渗透压' },
    { latex: '\\text{渗透压间隙} = \\text{测定渗透压} - \\text{计算渗透压}', name: '渗透压间隙' },
    { latex: '\\text{校正钠} = \\text{测定钠} + 1.6 \\times \\frac{\\text{葡萄糖} - 100}{100}', name: '高血糖校正钠' },
    { latex: '\\text{网织红细胞指数} = \\frac{\\text{网织红}(\\%) \\times \\text{Hct}}{45} \\times \\frac{1}{\\text{成熟时间}}', name: '网织红细胞指数' },
    { latex: '\\text{LDL} = \\text{TC} - \\text{HDL} - \\frac{\\text{TG}}{5}', name: 'LDL计算(Friedewald)' }
  ],
  pediatric: [
    { latex: '\\text{Apgar评分} = \\sum(\\text{心率+呼吸+肌张力+反射+肤色})', name: 'Apgar评分' },
    { latex: '\\text{体重}(kg) = \\text{年龄} \\times 2 + 8', name: '儿童体重估算' },
    { latex: '\\text{补液量} = \\text{维持量} + \\text{累积损失} + \\text{继续损失}', name: '儿童补液总量' },
    { latex: '\\text{维持液体}(ml/天) = 100(前10kg) + 50(10-20kg) + 20(>20kg)', name: '儿童维持液量' },
    { latex: '\\text{脱水程度}(\\%) = \\frac{\\text{病前体重} - \\text{现体重}}{\\text{病前体重}} \\times 100', name: '脱水程度' },
    { latex: '\\text{补钠量}(mmol) = (\\text{目标钠} - \\text{实际钠}) \\times 0.6 \\times \\text{体重}', name: '钠缺失量' },
    { latex: '\\text{胎龄}(周) = \\frac{\\text{末次月经至今天数}}{7}', name: '胎龄计算' },
    { latex: '\\text{预产期} = \\text{末次月经月份} - 3(或+9), \\text{日期} + 7', name: '预产期计算' }
  ],
  clinical: [
    { latex: '\\text{Glasgow昏迷评分} = \\text{E} + \\text{V} + \\text{M}', name: 'GCS评分(3-15分)' },
    { latex: '\\text{MELD} = 3.78\\ln(\\text{胆红素}) + 11.2\\ln(\\text{INR}) + 9.57\\ln(\\text{肌酐}) + 6.43', name: 'MELD评分' },
    { latex: '\\text{CHA}_2\\text{DS}_2\\text{-VASc评分}', name: '房颤卒中风险评分' },
    { latex: '\\text{Wells评分}', name: 'DVT风险评分' },
    { latex: '\\text{CURB-65} = C + U + R + B + 65', name: '肺炎严重度评分' },
    { latex: '\\text{Child-Pugh} = \\sum(\\text{脑病+腹水+胆红素+白蛋白+PT})', name: '肝功能分级' }
  ]
}

// 工具栏配置
const toolbarConfig = {
  excludeKeys: ['insertFormula', 'editFormula'] // 排除插入公式和编辑公式按钮
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      // 自定义上传
      async customUpload(file: File, insertFn: (url: string, alt: string, href: string) => void) {
        // 这里可以实现图片上传到服务器
        // 暂时使用 base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          insertFn(url, '', '')
        }
        reader.readAsDataURL(file)
      }
    }
  }
}

// 手动打开公式对话框（完整模式）
const openFormulaDialog = () => {
  isSimpleMode.value = false
  formulaDialogVisible.value = true
  customFormula.value = ''
  activeFormulaTab.value = 'math'
  showCustomPreview.value = false // 重置预览状态
}

// 切换预览显示
const togglePreview = () => {
  showCustomPreview.value = !showCustomPreview.value
  if (showCustomPreview.value) {
    renderCustomPreview()
  }
}

// 渲染自定义公式预览
const renderCustomPreview = () => {
  nextTick(() => {
    if (customFormula.value && customPreviewRef.value) {
      try {
        katex.render(customFormula.value, customPreviewRef.value, {
          throwOnError: false,
          displayMode: true
        })
      } catch (error) {
        console.error('公式预览失败:', error)
      }
    }
  })
}

// 监听自定义公式变化，如果预览已显示则自动更新
watch(customFormula, () => {
  if (showCustomPreview.value) {
    renderCustomPreview()
  }
})

// 插入公式模板到输入框
const insertFormulaTemplate = (latex: string) => {
  customFormula.value = latex
  activeFormulaTab.value = 'custom'
  // 自动显示预览
  showCustomPreview.value = true
  renderCustomPreview()
}

// 确认插入公式
const confirmInsertFormula = () => {
  if (!customFormula.value.trim()) {
    ElMessage.warning('请输入或选择公式')
    return
  }

  const editor = editorRef.value
  if (!editor) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorInstance = editor as any

    // 创建公式节点
    const formulaNode = {
      type: 'formula',
      value: customFormula.value,
      children: [{ text: '' }]
    }

    // 插入节点
    editorInstance.insertNode(formulaNode)

    formulaDialogVisible.value = false
    customFormula.value = ''
    ElMessage.success('公式已插入')
  } catch (error) {
    console.error('插入公式失败:', error)
    ElMessage.error('插入失败，请重试')
  }
}

// 编辑器创建完成
const handleCreated = (editor: unknown) => {
  editorRef.value = editor
  console.log('编辑器已创建', editor)
  ElMessage.success('编辑器加载完成')
  isLoading.value = false  // 编辑器创建完成后关闭加载状态
}

// 组件挂载时设置加载状态
onMounted(() => {
  // 延迟一小段时间，确保编辑器完全初始化
  setTimeout(() => {
    if (isLoading.value && !editorRef.value) {
      isLoading.value = false
    }
  }, 3000)  // 3秒超时保护
})

// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ; (editor as any).destroy()
})

// 渲染公式
const renderFormulas = () => {
  nextTick(() => {
    // 查找所有公式元素
    const formulaElements = document.querySelectorAll('[data-w-e-type="formula"]')
    formulaElements.forEach((element) => {
      const formulaValue = element.getAttribute('data-value')
      if (formulaValue) {
        try {
          // 判断是行内还是块级公式
          const isInline = element.getAttribute('data-w-e-is-inline') !== null
          katex.render(formulaValue, element as HTMLElement, {
            throwOnError: false,
            displayMode: !isInline
          })
        } catch (error) {
          console.error('公式渲染失败:', error)
        }
      }
    })
  })
}

// 获取内容
const getContent = () => {
  previewContent.value = valueHtml.value
  renderFormulas()
  ElMessage.success('内容已更新到预览区域')
  console.log('编辑器内容：', valueHtml.value)
}

// 获取 HTML
const getHtml = () => {
  const editor = editorRef.value
  if (editor == null) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log('HTML:', (editor as any).getHtml())
  ElMessage.success('HTML 已输出到控制台')
}

// 设置内容
const setContent = () => {
  const sampleContent = `
    <h2>这是一个示例标题</h2>
    <p style="text-indent: 2em;">这是一段示例文本，展示了富文本编辑器的基本功能。</p>
    <ul>
      <li>列表项 1</li>
      <li>列表项 2</li>
      <li>列表项 3</li>
    </ul>
    <p><strong>加粗文本</strong> <em>斜体文本</em> <u>下划线文本</u></p>
    <p>数学公式示例：<span data-w-e-type="formula" data-w-e-is-void data-w-e-is-inline data-value="c = \\sqrt{a^2 + b^2}"></span></p>
    <p>行内公式：<span data-w-e-type="formula" data-w-e-is-void data-w-e-is-inline data-value="E=mc^2"></span></p>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>表头1</th>
          <th>表头2</th>
          <th>表头3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>数据1</td>
          <td>数据2</td>
          <td>数据3</td>
        </tr>
      </tbody>
    </table>
  `
  valueHtml.value = sampleContent
  // 同时更新预览区域
  previewContent.value = sampleContent
  renderFormulas()
  ElMessage.success('已设置示例内容（包含数学公式）')
}

// 清空内容
const clearContent = () => {
  valueHtml.value = ''
  previewContent.value = ''
  ElMessage.info('内容已清空')
}
</script>

<style lang="scss" scoped>
/* 加载状态样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.loading-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 20px;
    border: 3px solid #e4e7ed;
    border-top: 3px solid #409eff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    margin: 0;
    color: #606266;
    font-size: 16px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.ueditor-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  h2 {
    margin: 0;
    color: #303133;
    font-size: 24px;
  }

  .actions {
    display: flex;
    gap: 10px;
  }
}

.editor-wrapper {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  :deep(.edui-default) {
    line-height: normal;
  }
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

  :deep(.el-card) {
    .el-card__body {
      min-height: 200px;

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 10px 0;
      }

      p {
        margin: 8px 0;
        line-height: 1.8;
      }

      ul,
      ol {
        padding-left: 20px;
        margin: 10px 0;
      }

      table {
        margin: 10px 0;

        th,
        td {
          padding: 8px;
          text-align: left;
        }
      }

      img {
        max-width: 100%;
        height: auto;
      }

      // 数学公式样式
      .katex {
        font-size: 1.1em;
      }

      .katex-display {
        margin: 1em 0;
      }
    }
  }
}

// 公式对话框样式
.formula-dialog {
  :deep(.el-tabs__content) {
    max-height: 450px;
    overflow-y: auto;
  }

  .formula-category {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px 0;
      padding: 8px 0;
      border-bottom: 2px solid #409eff;
      color: #303133;
      font-size: 15px;
      font-weight: 600;
    }

    .formula-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px 0;

      .el-button {
        min-width: auto;
        padding: 10px 16px;
        font-size: 13px;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          background-color: #ecf5ff;
          border-color: #409eff;
          color: #409eff;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }
      }
    }
  }

  .preview-controls {
    margin-top: 16px;
    display: flex;
    justify-content: center;
  }

  .formula-preview {
    margin-top: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
    border-radius: 6px;
    border: 1px solid #dcdfe6;
    animation: fadeIn 0.3s ease-in;

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #606266;
      font-weight: 600;
    }

    .preview-content {
      padding: 15px;
      background: white;
      border-radius: 4px;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  }

  :deep(.el-textarea__inner) {
    font-family: 'Courier New', monospace;
    font-size: 14px;
  }
}
</style>
