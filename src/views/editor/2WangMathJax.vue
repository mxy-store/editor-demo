<template>
  <div class="wang-mathjax-container">
    <div class="header">
      <h2>富文本编辑器(WangEditor + MathJax)</h2>
      <div class="actions">
        <el-button type="success" @click="showFormulaDialog = true">
          <span style="font-size: 16px; font-weight: bold;">f(x)</span> 插入公式
        </el-button>
        <el-button type="primary" @click="getContent">获取内容</el-button>
        <el-button @click="insertSampleFormulas">插入示例公式</el-button>
        <el-button @click="clearContent">清空</el-button>
      </div>
    </div>

    <div class="editor-wrapper">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 300px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>

    <!-- 公式插入对话框 -->
    <el-dialog v-model="showFormulaDialog" title="插入公式 - 数学 | 化学 | 物理 | 医学" width="90%" top="5vh"
      :close-on-click-modal="false">
      <div class="formula-dialog-content">
        <el-tabs v-model="activeTab" type="card">
          <!-- 数学公式 -->
          <el-tab-pane label="数学公式" name="math">
            <div class="formula-section">
              <h4>基础数学</h4>
              <div class="formula-grid">
                <el-button v-for="item in mathFormulas.basic" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>希腊字母</h4>
              <div class="formula-grid">
                <el-button v-for="item in mathFormulas.greek" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>微积分</h4>
              <div class="formula-grid">
                <el-button v-for="item in mathFormulas.calculus" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>矩阵</h4>
              <div class="formula-grid">
                <el-button v-for="item in mathFormulas.matrix" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 化学公式 -->
          <el-tab-pane label="化学公式 (mhchem)" name="chemistry">
            <div class="formula-section">
              <h4>常见分子式</h4>
              <div class="formula-grid">
                <el-button v-for="item in chemFormulas.molecules" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>化学反应</h4>
              <div class="formula-grid">
                <el-button v-for="item in chemFormulas.reactions" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>离子与电荷</h4>
              <div class="formula-grid">
                <el-button v-for="item in chemFormulas.ions" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>化学符号</h4>
              <div class="formula-grid">
                <el-button v-for="item in chemFormulas.symbols" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 物理公式 -->
          <el-tab-pane label="物理公式" name="physics">
            <div class="formula-section">
              <h4>经典力学</h4>
              <div class="formula-grid">
                <el-button v-for="item in physicsFormulas.mechanics" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>电磁学</h4>
              <div class="formula-grid">
                <el-button v-for="item in physicsFormulas.electromagnetism" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>热力学</h4>
              <div class="formula-grid">
                <el-button v-for="item in physicsFormulas.thermodynamics" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>光学</h4>
              <div class="formula-grid">
                <el-button v-for="item in physicsFormulas.optics" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 医学公式 -->
          <el-tab-pane label="医学公式" name="medical">
            <div class="formula-section">
              <h4>体格测量</h4>
              <div class="formula-grid">
                <el-button v-for="item in medicalFormulas.bmi" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>药物剂量</h4>
              <div class="formula-grid">
                <el-button v-for="item in medicalFormulas.dosage" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>心血管</h4>
              <div class="formula-grid">
                <el-button v-for="item in medicalFormulas.cardiovascular" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>肾脏功能</h4>
              <div class="formula-grid">
                <el-button v-for="item in medicalFormulas.renal" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>呼吸系统</h4>
              <div class="formula-grid">
                <el-button v-for="item in medicalFormulas.respiratory" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
            <div class="formula-section">
              <h4>实验室检查</h4>
              <div class="formula-grid">
                <el-button v-for="item in medicalFormulas.laboratory" :key="item.latex" size="small"
                  @click="insertFormula(item.latex)">
                  {{ item.name }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 自定义输入 -->
          <el-tab-pane label="自定义输入" name="custom">
            <div class="custom-input-section">
              <el-input v-model="customFormula" type="textarea" :rows="6"
                placeholder="输入 LaTeX 公式，例如：&#10;数学公式: E = mc^2&#10;化学公式: \ce{H2O}&#10;&#10;提示：化学公式需要使用 \ce{} 包裹" />
              <div class="preview-area" v-if="customFormula">
                <h4>实时预览：</h4>
                <div class="preview-content" v-html="previewCustomFormula"></div>
              </div>
              <div class="formula-tips">
                <p><strong>数学公式示例：</strong></p>
                <ul>
                  <li>分数：<code>\frac{a}{b}</code></li>
                  <li>根号：<code>\sqrt{x}</code></li>
                  <li>积分：<code>\int_{a}^{b} f(x) dx</code></li>
                  <li>求和：<code>\sum_{i=1}^{n} x_i</code></li>
                </ul>
                <p><strong>化学公式示例（需要 \ce{} 包裹）：</strong></p>
                <ul>
                  <li>分子式：<code>\ce{H2O}</code></li>
                  <li>反应：<code>\ce{2H2 + O2 -> 2H2O}</code></li>
                  <li>离子：<code>\ce{Fe^{2+}}</code></li>
                  <li>平衡：<code>\ce{A &lt;=&gt; B}</code></li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="showFormulaDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertCustomFormula" :disabled="!customFormula">确定插入</el-button>
      </template>
    </el-dialog>

    <div class="preview">
      <h3>内容预览（MathJax 渲染）：</h3>
      <el-card>
        <div ref="previewRef" v-html="previewContent"></div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
// @ts-expect-error - wangeditor vue wrapper does not have type definitions
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
import formulaModule from '@wangeditor/plugin-formula'
import { ElMessage } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css'

// 声明 MathJax 全局变量
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MathJax?: any
  }
}

// 注册公式插件
Boot.registerModule(formulaModule)

const editorRef = shallowRef()
const valueHtml = ref('<p>欢迎使用 WangEditor + MathJax + mhchem 富文本编辑器！</p><p>点击上方按钮插入数学公式或化学公式。</p>')
const previewContent = ref('')
const previewRef = ref<HTMLElement>()
const mode = ref('default')

// 公式对话框
const showFormulaDialog = ref(false)
const activeTab = ref('math')
const customFormula = ref('')
const previewCustomFormula = ref('')

// 数学公式模板
const mathFormulas = {
  basic: [
    { latex: '\\frac{a}{b}', name: '分数' },
    { latex: '\\sqrt{x}', name: '平方根' },
    { latex: '\\sqrt[n]{x}', name: 'n次根' },
    { latex: 'x^{n}', name: '幂' },
    { latex: 'x_{n}', name: '下标' },
    { latex: '\\pm', name: '±' },
    { latex: '\\times', name: '×' },
    { latex: '\\div', name: '÷' },
    { latex: '\\neq', name: '≠' },
    { latex: '\\leq', name: '≤' },
    { latex: '\\geq', name: '≥' },
    { latex: '\\approx', name: '≈' },
    { latex: '\\infty', name: '∞' },
    { latex: 'a^2 + b^2 = c^2', name: '勾股定理' }
  ],
  greek: [
    { latex: '\\alpha', name: 'α' },
    { latex: '\\beta', name: 'β' },
    { latex: '\\gamma', name: 'γ' },
    { latex: '\\delta', name: 'δ' },
    { latex: '\\epsilon', name: 'ε' },
    { latex: '\\theta', name: 'θ' },
    { latex: '\\lambda', name: 'λ' },
    { latex: '\\mu', name: 'μ' },
    { latex: '\\pi', name: 'π' },
    { latex: '\\rho', name: 'ρ' },
    { latex: '\\sigma', name: 'σ' },
    { latex: '\\phi', name: 'φ' },
    { latex: '\\omega', name: 'ω' },
    { latex: '\\Omega', name: 'Ω' }
  ],
  calculus: [
    { latex: '\\int_{a}^{b} f(x) dx', name: '定积分' },
    { latex: '\\sum_{i=1}^{n} x_i', name: '求和' },
    { latex: '\\prod_{i=1}^{n} x_i', name: '连乘' },
    { latex: '\\lim_{x \\to \\infty} f(x)', name: '极限' },
    { latex: '\\frac{dy}{dx}', name: '导数' },
    { latex: '\\frac{\\partial f}{\\partial x}', name: '偏导数' },
    { latex: '\\oint', name: '环路积分' },
    { latex: '\\nabla', name: '梯度' }
  ],
  matrix: [
    { latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', name: '2×2矩阵' },
    { latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', name: '方括号矩阵' },
    { latex: '\\vec{a}', name: '向量' },
    { latex: '\\hat{a}', name: '单位向量' }
  ]
}

// 化学公式模板 (mhchem)
const chemFormulas = {
  molecules: [
    { latex: '\\ce{H2O}', name: '水' },
    { latex: '\\ce{CO2}', name: '二氧化碳' },
    { latex: '\\ce{NH3}', name: '氨气' },
    { latex: '\\ce{H2SO4}', name: '硫酸' },
    { latex: '\\ce{NaCl}', name: '氯化钠' },
    { latex: '\\ce{C6H12O6}', name: '葡萄糖' },
    { latex: '\\ce{CH4}', name: '甲烷' },
    { latex: '\\ce{O2}', name: '氧气' },
    { latex: '\\ce{N2}', name: '氮气' },
    { latex: '\\ce{HNO3}', name: '硝酸' },
    { latex: '\\ce{NaOH}', name: '氢氧化钠' },
    { latex: '\\ce{CaCO3}', name: '碳酸钙' }
  ],
  reactions: [
    { latex: '\\ce{2H2 + O2 -> 2H2O}', name: '燃烧反应' },
    { latex: '\\ce{A + B <=> C + D}', name: '可逆反应' },
    { latex: '\\ce{A ->[H+] B}', name: '催化反应' },
    { latex: '\\ce{A + B <=>> C}', name: '平衡反应' },
    { latex: '\\ce{CaCO3 ->[\\Delta] CaO + CO2 ^}', name: '加热分解' },
    { latex: '\\ce{Fe + CuSO4 -> FeSO4 + Cu}', name: '置换反应' },
    { latex: '\\ce{NaOH + HCl -> NaCl + H2O}', name: '中和反应' }
  ],
  ions: [
    { latex: '\\ce{Fe^{2+}}', name: '亚铁离子' },
    { latex: '\\ce{Fe^{3+}}', name: '铁离子' },
    { latex: '\\ce{Cu^{2+}}', name: '铜离子' },
    { latex: '\\ce{SO4^{2-}}', name: '硫酸根' },
    { latex: '\\ce{OH-}', name: '氢氧根' },
    { latex: '\\ce{Cl-}', name: '氯离子' },
    { latex: '\\ce{H+}', name: '氢离子' },
    { latex: '\\ce{NH4+}', name: '铵根' }
  ],
  symbols: [
    { latex: '\\ce{^}', name: '↑ 气体' },
    { latex: '\\ce{v}', name: '↓ 沉淀' },
    { latex: '\\ce{[\\Delta]}', name: 'Δ 加热' },
    { latex: '\\ce{<=>}', name: '⇌ 可逆' },
    { latex: '\\ce{<-->}', name: '↔ 共振' },
    { latex: '\\ce{<<=>}', name: '⇋ 平衡移动' }
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
    { latex: 'v = v_0 + at', name: '匀变速运动' },
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
    { latex: 'PV = nRT', name: '理想气体方程' },
    { latex: 'Q = cm\\Delta T', name: '热量' },
    { latex: '\\Delta U = Q - W', name: '热力学第一定律' },
    { latex: 'W = P\\Delta V', name: '气体做功' },
    { latex: 'C_p - C_v = R', name: '迈耶公式' }
  ],
  optics: [
    { latex: '\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}', name: '透镜公式' },
    { latex: 'n = \\frac{c}{v}', name: '折射率' },
    { latex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2', name: '折射定律' },
    { latex: 'I = \\frac{P}{4\\pi r^2}', name: '光强公式' }
  ]
}

// 医学公式模板
const medicalFormulas = {
  bmi: [
    { latex: '\\text{BMI} = \\frac{\\text{体重(kg)}}{\\text{身高}^2(m^2)}', name: 'BMI 体重指数' },
    { latex: '\\text{BSA} = \\sqrt{\\frac{\\text{身高} \\times \\text{体重}}{3600}}', name: '体表面积' },
    { latex: '\\text{IBW}_男 = 50 + 2.3 \\times (\\text{身高} - 60)', name: '理想体重(男)' },
    { latex: '\\text{IBW}_女 = 45.5 + 2.3 \\times (\\text{身高} - 60)', name: '理想体重(女)' }
  ],
  dosage: [
    { latex: '\\text{剂量} = \\frac{\\text{体重} \\times \\text{单位剂量}}{1}', name: '体重剂量' },
    { latex: '\\text{滴速} = \\frac{\\text{液体总量} \\times \\text{滴系数}}{\\text{时间}}', name: '静脉滴速' },
    { latex: '\\text{儿童剂量} = \\text{成人剂量} \\times \\frac{\\text{体重}}{70}', name: '儿童剂量' },
    { latex: '\\text{泵速} = \\frac{\\text{剂量} \\times \\text{体重} \\times 60}{\\text{浓度}}', name: '微量泵速度' }
  ],
  cardiovascular: [
    { latex: '\\text{MAP} = \\text{DBP} + \\frac{1}{3}(\\text{SBP} - \\text{DBP})', name: '平均动脉压' },
    { latex: '\\text{CO} = \\text{HR} \\times \\text{SV}', name: '心输出量' },
    { latex: '\\text{CI} = \\frac{\\text{CO}}{\\text{BSA}}', name: '心脏指数' },
    { latex: '\\text{EF} = \\frac{\\text{SV}}{\\text{EDV}} \\times 100', name: '射血分数' },
    { latex: '\\text{SVR} = \\frac{(\\text{MAP} - \\text{CVP}) \\times 80}{\\text{CO}}', name: '体循环阻力' }
  ],
  renal: [
    { latex: '\\text{CCr} = \\frac{\\text{尿肌酐} \\times \\text{尿量}}{\\text{血肌酐} \\times \\text{时间}}', name: '肌酐清除率' },
    { latex: '\\text{eGFR} = 186 \\times \\text{SCr}^{-1.154} \\times \\text{年龄}^{-0.203}', name: 'eGFR' },
    { latex: '\\text{CCr} = \\frac{(140 - \\text{年龄}) \\times \\text{体重}}{72 \\times \\text{SCr}}', name: 'Cockcroft-Gault' },
    { latex: '\\text{FENa} = \\frac{\\text{尿钠} \\times \\text{血肌酐}}{\\text{血钠} \\times \\text{尿肌酐}} \\times 100', name: '钠排泄分数' }
  ],
  respiratory: [
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}}', name: '通气血流比' },
    { latex: '\\dot{V}_A = 4.2\\text{ L/min}', name: '肺泡通气量' },
    { latex: '\\dot{Q} = 5.0\\text{ L/min}', name: '肺血流量' },
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} \\approx 0.8', name: '正常V̇A/Q̇比值' },
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} = 0', name: '分流状态' },
    { latex: '\\frac{\\dot{V}_A}{\\dot{Q}} = \\infty', name: '死腔状态' },
    { latex: 'Q_s = 5.0\\text{ L/min}', name: '心输出量' },
    { latex: 'P_{O_2} = 40\\text{ mmHg}', name: '静脉血氧分压' },
    { latex: 'P_{CO_2}', name: '二氧化碳分压' },
    { latex: '\\text{A-a梯度} = \\text{PAO}_2 - \\text{PaO}_2', name: 'A-a氧梯度' },
    { latex: '\\frac{\\text{PaO}_2}{\\text{FiO}_2}', name: 'P/F比值' },
    { latex: '\\text{VT} = 6-8 \\text{ ml/kg}', name: '潮气量' },
    { latex: '\\text{MV} = \\text{VT} \\times \\text{RR}', name: '分钟通气量' }
  ],
  laboratory: [
    { latex: '\\text{AG} = \\text{Na}^+ - (\\text{Cl}^- + \\text{HCO}_3^-)', name: '阴离子间隙' },
    { latex: '\\text{校正钙} = \\text{测定钙} + 0.8 \\times (4 - \\text{白蛋白})', name: '校正血钙' },
    { latex: '\\text{渗透压} = 2\\text{Na} + \\frac{\\text{葡萄糖}}{18} + \\frac{\\text{BUN}}{2.8}', name: '血清渗透压' },
    { latex: '\\text{LDL} = \\text{TC} - \\text{HDL} - \\frac{\\text{TG}}{5}', name: 'LDL计算' }
  ]
}

// 工具栏配置
const toolbarConfig = {
  excludeKeys: []
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: (url: string) => void) {
        const reader = new FileReader()
        reader.onload = (e) => {
          insertFn(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }
}

// 初始化 MathJax
const initMathJax = () => {
  if (window.MathJax) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    // 配置 MathJax
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        packages: { '[+]': ['mhchem'] } // 加载 mhchem 扩展
      },
      loader: {
        load: ['[tex]/mhchem']
      },
      svg: {
        fontCache: 'global'
      },
      startup: {
        ready: () => {
          window.MathJax.startup.defaultReady()
          console.log('MathJax 已加载，支持的包:', window.MathJax.startup.loadedExtensions)
          resolve()
        }
      }
    }

    // 加载 MathJax 脚本 - 使用包含所有扩展的版本
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    script.async = true
    script.onerror = () => {
      console.error('MathJax 加载失败')
      resolve()
    }
    document.head.appendChild(script)
  })
}

// 渲染公式
const renderMathJax = () => {
  if (window.MathJax && window.MathJax.typesetPromise) {
    nextTick(() => {
      const elements = previewRef.value ? [previewRef.value] : []
      if (elements.length > 0) {
        window.MathJax.typesetClear(elements)
        window.MathJax.typesetPromise(elements).catch((err: Error) => {
          console.error('MathJax 渲染失败:', err)
        })
      }
    })
  }
}

// 插入公式模板到自定义输入
const insertFormula = (latex: string) => {
  // 跳转到自定义输入标签页
  activeTab.value = 'custom'
  // 设置公式内容
  customFormula.value = latex
  // 不关闭对话框，等待用户确认
}

// 确认插入自定义公式
const confirmInsertCustomFormula = () => {
  if (!customFormula.value.trim()) {
    ElMessage.warning('请输入公式内容')
    return
  }

  const editor = editorRef.value
  if (!editor) {
    ElMessage.error('编辑器未初始化')
    return
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorInstance = editor as any

    // 获取当前HTML内容
    const currentHtml = editorInstance.getHtml()

    // 构建公式HTML
    const formulaHtml = `<p><span class="math-formula">$$${customFormula.value.trim()}$$</span></p>`

    // 直接拼接HTML并设置
    let newHtml = ''
    if (!currentHtml || currentHtml === '<p><br></p>' || currentHtml.trim() === '') {
      newHtml = formulaHtml
    } else {
      // 移除末尾的空段落标签，然后追加新公式
      newHtml = currentHtml.replace(/<p><br><\/p>$/, '') + formulaHtml
    }

    editorInstance.setHtml(newHtml)

    console.log('插入的公式:', customFormula.value.trim())
    console.log('编辑器当前HTML:', editorInstance.getHtml())

    // 关闭对话框并清空输入
    showFormulaDialog.value = false
    customFormula.value = ''

    // 自动更新预览区域
    nextTick(() => {
      getContent()
    })

    ElMessage.success('公式已插入，请查看下方预览区域的渲染效果')
  } catch (error) {
    console.error('插入公式失败:', error)
    ElMessage.error('插入公式失败，请重试')
  }
}// 监听自定义公式变化，实时预览
watch(customFormula, (newVal) => {
  if (newVal) {
    previewCustomFormula.value = `<div class="formula-preview">$$${newVal}$$</div>`
    nextTick(() => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetClear()
        window.MathJax.typesetPromise().catch((err: Error) => {
          console.error('预览渲染失败:', err)
        })
      }
    })
  } else {
    previewCustomFormula.value = ''
  }
})

// 获取内容
const getContent = () => {
  const editor = editorRef.value
  if (!editor) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html = (editor as any).getHtml()
  previewContent.value = html

  renderMathJax()

  ElMessage.success('内容已获取，请查看预览区域')
}

// 插入示例公式
const insertSampleFormulas = () => {
  const sampleHtml = `
    <h3>数学公式示例</h3>
    <p>勾股定理：<span class="math-formula">$$a^2 + b^2 = c^2$$</span></p>
    <p>欧拉公式：<span class="math-formula">$$e^{i\\pi} + 1 = 0$$</span></p>
    <p>积分公式：<span class="math-formula">$$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$</span></p>
    <p>矩阵：<span class="math-formula">$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$</span></p>

    <h3>化学公式示例 (mhchem)</h3>
    <p>水分子：<span class="math-formula">$$\\ce{H2O}$$</span></p>
    <p>燃烧反应：<span class="math-formula">$$\\ce{2H2 + O2 -> 2H2O}$$</span></p>
    <p>硫酸：<span class="math-formula">$$\\ce{H2SO4}$$</span></p>
    <p>可逆反应：<span class="math-formula">$$\\ce{A + B <=> C + D}$$</span></p>
    <p>离子：<span class="math-formula">$$\\ce{Fe^{3+} + 3OH- -> Fe(OH)3 v}$$</span></p>
    <p>加热分解：<span class="math-formula">$$\\ce{CaCO3 ->[\\Delta] CaO + CO2 ^}$$</span></p>
  `

  const editor = editorRef.value
  if (editor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).dangerouslyInsertHtml(sampleHtml)
    ElMessage.success('示例公式已插入')
  }
}

// 清空内容
const clearContent = () => {
  const editor = editorRef.value
  if (editor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).clear()
    previewContent.value = ''
    ElMessage.success('内容已清空')
  }
}

// 编辑器创建完成
const handleCreated = (editor: unknown) => {
  editorRef.value = editor
  console.log('编辑器已创建', editor)
}

// 组件挂载
onMounted(async () => {
  await initMathJax()
  ElMessage.success('MathJax + mhchem 加载完成')
})

// 组件卸载
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).destroy()
  }
})
</script>

<style scoped>
.wang-mathjax-container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.editor-wrapper {
  border: 1px solid #ccc;
  z-index: 100;
  margin-bottom: 20px;
}

.preview {
  margin-top: 20px;
}

.preview h3 {
  margin-bottom: 10px;
  color: #333;
}

/* 公式对话框样式 */
.formula-dialog-content {
  min-height: 400px;
}

.formula-section {
  margin-bottom: 24px;
}

.formula-section h4 {
  color: #333;
  font-size: 16px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.formula-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.formula-grid .el-button {
  font-size: 13px;
}

/* 自定义输入区域 */
.custom-input-section {
  padding: 20px;
}

.preview-area {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.preview-area h4 {
  margin-bottom: 12px;
  color: #333;
}

.preview-content {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 16px;
  border-radius: 4px;
}

.formula-tips {
  margin-top: 20px;
  padding: 16px;
  background: #e7f3ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.formula-tips p {
  margin: 8px 0;
  color: #333;
  font-weight: 600;
}

.formula-tips ul {
  margin: 8px 0;
  padding-left: 24px;
}

.formula-tips li {
  margin: 4px 0;
  color: #666;
}

.formula-tips code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #e83e8c;
}

/* MathJax 公式样式 */
:deep(.math-formula) {
  display: inline-block;
  margin: 0 4px;
}

:deep(.el-card__body) {
  min-height: 100px;
  line-height: 1.8;
}

/* 公式预览样式 */
:deep(.formula-preview) {
  font-size: 18px;
  padding: 12px;
}

/* MathJax 渲染后的样式调整 */
:deep(.MathJax) {
  font-size: 1.1em !important;
}
</style>
