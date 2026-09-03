---
title: "中国科学院近代物理研究所 8 周工作志"
date: 2026-08-28
traditional: false
---

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/imp-campus-entrance.webp" alt="中国科学院近代物理研究所园区入口" width="480" height="640" loading="eager" decoding="async">
  <figcaption>八周实习所在的中国科学院近代物理研究所。</figcaption>
</figure>

<p class="post-lede">从“得到结果”到“建立证据”：一次科研工程实践中的能力演进。</p>

在进入大四前的这个暑假，我进入中国科学院近代物理研究所高功率束流室完成了 8 周生产实习。团队已有论文、FLUKA 能量沉积结果和 ANSYS 工程模型；本人基于上游 FLUKA 粒子输运计算，负责接住其输出，推进热工仿真接口、Fluent 工程继承、数据与功率验证、CAD/网格诊断及部分热物性实验。

实习结束时，新版正式模型尚未完成体网格、热源挂接和热应力求解；但旧热源链、新数据接口、关键误差解释和几何故障定位已经形成可追溯证据。能力变化也由此变得清晰：从“把软件跑起来”，逐步转向“证明结果为什么可信”。

## 从软件使用者，到工程接手者

自学起点依次是 Fluent 二维、三维最小案例和已有论文复现，之后加入已有 Fluent—Mechanical 工程。

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/fluent-thermal-result.webp" alt="Fluent 热工结果与能量计划诊断页面" width="480" height="270" loading="lazy" decoding="async">
  <figcaption>早期工程热工结果与能量计划诊断：先把计算链跑通，再逐项核对能量与边界。</figcaption>
</figure>

早期已经能够完成建模、网格、边界和求解设置，并独立核算冷却水约 7.97 kg/s、温升 0.98 ℃、换热约 32.48 kW。

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/handover-status.webp" alt="工程继承进度与关键指标状态页" width="360" height="202" loading="lazy" decoding="async">
  <figcaption>复杂工程真正需要接手的，不只是模型文件，还包括数据来源、接口逻辑、验证状态与尚未闭合的边界。</figcaption>
</figure>

真正接手复杂工程后，困难迅速从“软件怎么操作”变成“文件从哪里来、UDF 做了什么、哪个区域加载了什么数据、哪些结论已经验证”。这既暴露了自身复杂仿真经验不足，也暴露了旧工程在接口说明和状态交接上的不足。GitHub 因此逐渐从日志仓库变成轻量级工程管理工具，持续固化每日事实、代码、验证结果和未完成边界。

## 从“模型能跑”，到“结果必须可信”

旧 `.29 → Python/C → UDF → Fluent` 热源链恢复后，Fluent 已经能给出约 210 ℃的温度结果。但继续核算发现：

- FLUKA 完整计分盒功率：46.800 kW；
- zones 8–11 映射功率：38.178 kW；
- 真正加载在 zone 10 铜区的功率：37.243 kW；
- 相对完整计分盒存在 18.422% 的净缺口。

直觉上可以把它解释为“18% 的单元没有映射”，但 zone 10 映射体积约 99.999962%，空体素只占总功率 0.0615%。逐体素收支最终把缺口闭合为约 8.621 kW：主因是 FLUKA 完整规则计分盒与 Fluent 实际几何区域并不完全重合；同时，基于单元质心的离散映射还会造成逐体素欠填充和过填充。两者共同导致完整 FLUKA 盒积分功率与 Fluent 映射功率不一致。

这一阶段真正发生的变化，不是多写了几个 UDF，而是开始把**单位、区域、总量、空间映射和守恒**放在温度云图之前。

> **求解器给出数值，只说明计算结束，不说明验证结束。**

## 从处理异常，到追溯根因

新 FLUKA 网格理论应有 34,560,000 个数据，而 `.30.lis` 只读到 14,786,930 个。最初只记录异常，没有立即判定文件损坏；随后直接解析原始 `fort.30`，找到完整 34.56M 个 float32，并由 Python 与 Fluent UDF 独立核对数量、总和、峰值和 Hash。按 5 mA 归一化后，全域积分功率为 31.035 kW。证据闭合后，才能确认 ASCII 文件只是原始矩阵的截断前缀。

这使我形成了一个更严格的认识：**输入文件同样不是天然事实，数据来源和完整性也需要验证。**

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/cad-meshing-workstation.webp" alt="在工作站检查 CAD 与网格问题" width="360" height="270" loading="lazy" decoding="async">
  <figcaption>CAD / Fluent Meshing 排障：故障表现在 Fluent，根因却可能位于更上游的几何设计与交付。</figcaption>
</figure>

CAD/Fluent Meshing 排障进一步把工作方式从“调参数”推向“追根因”。0.5 mm 局部加密使表面网格增至约 631 万面，问题反而扩散；随后发现铜体与冷却管存在真实穿模，部分螺旋管还与主体被合并为同一 Solid。TUI 诊断中，主体与 wall.5、wall.6 分别存在约 79,829 和 69,515 个 inter-zone intersection，而健康对照 wall.7 为 0。删除可疑管路后，Share 能够继续完成 region computation。

故障表现在 Fluent，根因却位于上游 CAD 设计与交付。这使我开始把仿真排障理解为一种科研工程“运维”：不仅修当前故障，还要追问设计交付、接口验收和配置管理为什么没有更早阻断问题。

实习后期，我们还对 DRPL-V 平板热流计导热系数测定设备做了大量实验，以检验其可信度与精准度。实验中发现，加热会引起被测物热膨胀、改变导热距离；室内湿度也不可忽略，冷却过程中热面会出现明显凝水，水焓会进一步影响接触热阻。真实实验环境中的问题往往多维并发，因此变量控制和计量意识比理想条件下更苛刻。

## 从独立个体，到科研协作链中的责任节点

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/thermal-conductivity-experiment.webp" alt="DRPL-V 平板热流计导热系数实验设备" width="360" height="480" loading="lazy" decoding="async">
  <figcaption>热物性实验让我再次看到：真实系统中的误差来源往往同时来自设备、环境、材料状态与操作过程。</figcaption>
</figure>

大型科研不是一个人完成全部环节。本人不负责 FLUKA 粒子输运计算，但仍必须理解上游输出的单位、数据规模、坐标和功率；同样，下游结果也必须以别人能够继续使用的形式交付。

科研独立性并不是“什么都自己做”，而是在明确职责边界内独立判断、审查输入、验证输出。一个科研系统的可靠性，还取决于接口是否明确、数据是否可追溯、设计交付是否规范、人员更替后知识能否继续传递。

AI 在本项目中显著降低了跨软件学习、代码草拟、故障假设和信息整理成本，也使高密度日志成为可能；但它同样可能造成认知外包、流畅性误导和错误方向的效率放大。项目后期形成的约束很明确：

- AI 提出解释，不等于事实成立；
- AI 生成代码，不等于程序正确；
- 软件正常运行，也不等于物理正确；
- 关键判断仍需原始数据、守恒关系、独立计算、健康对照和 A/B 验证；
- GitHub 负责维持版本、时间和事实边界。

从两个月的过程看，我已经形成了更强的陌生工程接手、数据验证和故障诊断意识。研究所老师关于“学习较快、能够深入问题和独立处理任务”的直观评价与此基本一致；不足也同样明确：前期 Meshing 问题分层较慢，数值离散、网格无关性、不确定度传播和实验计量学基础仍需补强。

下一阶段不应越过团队分工去替代上游 FLUKA 工作，而应继续深化热流体与多物理场数值方法，完善守恒型映射、模型验收、变更回归和实验不确定度。

八周实习留下的核心变化，不是掌握了多少软件，而是形成了一条更可靠的工作链：

> **从完成任务，到验证结果；从定位故障，到追问系统为何产生故障；再到考虑怎样让同类问题更少发生，让下一位接手者不必重新考古。**

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/hiaf-control-center.webp" alt="HIAF 中央控制楼前留影" width="360" height="270" loading="lazy" decoding="async">
  <figcaption>八周工作志的收尾：HIAF 中央控制楼。</figcaption>
</figure>
