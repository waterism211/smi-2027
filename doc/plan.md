# SMI 2027 网站计划

状态：**M1 本地已提交，等待确认创建公开仓库 `waterism211/smi-2027` 后部署**（尚未发布；保持草稿模式，Section 确认前不对外推广；之后可转移到 ASA-SII 组织）
最后更新：2026-11-04

## 1. 目标

为在 University of Maryland, College Park 举办的 ASA Statistical Methods in Imaging (SMI) 2027 建一个 GitHub Pages 托管的会议网站，内容框架参考 SMI 2026，并让组委会在会议筹备期内能方便地更新。

## 2. 参考站 SMI 2026 的情况

来源：`ASA-SII/website` 仓库的 `ASA-SII-2026/`，线上地址 https://asa-sii.github.io/website/ASA-SII-2026/

| 项目 | 现状 | 对 2027 的含义 |
|---|---|---|
| 结构 | 单个 `index.html`，2673 行、272 KB，CSS 和 JS 全部内联 | 沿用内容框架，不沿用单文件维护方式 |
| 日程 | 约 1170 行手写 HTML，总览和分日 tab 各写一份 | 改为数据文件生成，避免两处不一致 |
| 投稿 | 9 个 Google Forms 链接 | 继续用表单，网站不收集数据 |
| 注册 | 跳转 ASA 的 MemberSuite 活动页 | 网站不处理支付，只放链接 |
| 图片 | 人物照片大多外链到各校网站 | 经本人同意后存入本仓库，避免失效 |
| 托管 | 仓库根目录 legacy Pages，无 license | 代码不直接复制，需要复用时先征得同意 |

内容版块：About、Important Dates、Schedule、Call for Student Papers、Call for Posters、Call for Short Courses、Keynotes、Organizing Committee、Scientific Advisory Panel、Institutional Support、Student Support、Proceedings（SDSI 特刊）、Travel & Accommodation、Group Photos、Contact。

## 3. 建议方案（待确认）

### 托管

新建独立仓库，用 GitHub Actions 部署到 Pages，再请 ASA SI Section 在 `statsinimaging.org/events_smi/` 和 `ASA-SII/website` 的 README 加入口。

当前账号 `waterism211` 对 `ASA-SII/website` 只有 pull 权限，无法直接推送。仓库放在哪个账号或组织下见第 6 节。

### 技术栈

Eleventy 静态站点 + YAML/Markdown 内容文件，构建产物是纯 HTML/CSS，只有移动端菜单和日程 tab 用少量原生 JS。

```text
src/
  _data/      # dates, schedule, speakers, committee, sponsors, calls, travel 的 YAML
  pages/      # 各页面模板和 Markdown 正文
  assets/     # CSS、图片、PDF
scripts/      # 数据校验
.github/workflows/deploy.yml
doc/          # plan.md, changelog.md
```

组委会成员日常只改 YAML，可以直接在 GitHub 网页上编辑。

### 页面

| 页面 | 内容 | 上线阶段 |
|---|---|---|
| Home | 会议名称、日期地点、公告、关键日期、主要按钮 | M1 |
| Calls | 特邀专题、海报、短课程、学生论文奖 | M1 |
| Venue & Travel | 会场、交通、酒店 | M1 框架，M2 补全 |
| Committee | 组委会、顾问委员会 | M1 |
| Speakers | Keynote、特邀报告人 | M2 |
| Registration | 费用、截止日期、注册链接 | M2 |
| Student Support | 旅费资助、奖项、特刊 | M2 |
| Sponsors | 资助方及致谢 | M2 |
| Program | 分日日程、PDF 下载 | M3 |
| Past Meetings | 历届链接 | M1 |

### 视觉

使用 UMD 配色（红、金、黑、白，具体色值以 UMD 官方品牌指南为准）。UMD 校徽的使用需先按学校规定确认；未确认前只用文字标题。

## 4. 里程碑

会议日期未定，下面的时间按“与 2026 一样在 6 月初举办”估算，日期确定后调整。

| 里程碑 | 内容 | 目标时间 |
|---|---|---|
| M0 | 确认本计划和第 6 节的决策 | 2026-11 |
| M1 | 首发：日期地点、Calls、Committee 可上线 | 2026-11 至 12 月 |
| M2 | Keynote、注册、酒店、学生资助 | 2027-01 至 03 月 |
| M3 | 完整日程、PDF、海报列表 | 2027-04 至 05 月 |
| M4 | 会后：合影、获奖名单、归档 | 会后 1 个月内 |

SMI 2026 的网站在 2025 年 9 月上线，约为会前 9 个月。按同样的会期，2027 已经晚于这个节奏，所以 M1 应尽快发布，内容不全也可以先上线。

## 5. 验收标准

本项目是静态网站，AGENTS.md 中训练、GPU、experiment 目录的规定不适用；先计划、先 smoke、失败显式暴露的原则照常执行。

**Smoke（每次构建）**
- Eleventy 构建成功。
- YAML 数据校验：缺少必填字段、日程引用了不存在的报告人时，构建直接失败。
- 内部链接和锚点全部有效。

**上线前（每个里程碑）**
- 外部链接检查（表单、注册、酒店），失败项必须人工处理。
- 375 px 和 1280 px 宽度下无横向滚动，导航可用。
- 浅色背景上文字对比度达到 WCAG AA，图片有 alt 文本。
- 仍未确定的信息明确标为 TBA，不留占位假内容。

## 6. 待确认的决策

1. 会议日期、会场，以及 SMI 2027 由 UMD 主办是否已获 ASA SI Section 确认（公开渠道未查到 2027 的地点）。
2. ~~仓库归属：个人账号、新组织，还是 ASA-SII 组织。~~ 已确认（2026-11-04）：先放个人账号 `waterism211/smi-2027`，日后视 Section 意见转移。
3. 网址：`github.io` 地址、`statsinimaging.org/SMI-2027`，还是自有域名。
4. 谁负责更新内容，是否有不熟悉 Git 的组委会成员。
5. ~~技术栈：Eleventy + YAML，或沿用 2026 的单文件 HTML。~~ 已确认（2026-11-04）：Eleventy + YAML，页面结构按第 3 节。
6. 网站语言：建议只做英文。M1 先按英文实现。

决策 1 确认前，站点保持草稿模式：`site.yml` 中 `draft: true`，页面显示草稿提示并带 `noindex`；未确定的信息一律写 TBA。

## 7. 风险

| 风险 | 应对 |
|---|---|
| 主办信息未正式公布就上线 | 决策 1 确认前，站点不公开或不向外推广 |
| 只有一人会维护 | 内容与模板分离，并写一页维护说明 |
| 外链（酒店、表单）失效 | 上线前检查，会前再查一次 |
| 使用人物照片和校徽未获同意 | 上线前逐项确认，未确认的不放 |
| 联系邮箱或投稿数据泄露 | 仓库不存放投稿内容和个人信息 |

## 8. 下一步

1. ~~本地完成 M1（Home、Calls、Venue & Travel、Committee、Past Meetings）并通过 smoke。~~ 已完成（2026-11-04）。
2. 确定仓库归属后建仓库并部署。部署 workflow 只有在仓库建好后才能验证。上线前还要填入日期、会场、委员会、联系邮箱，并把 `draft` 改为 `false`。
3. M2 页面和日程数据校验（报告人引用）随对应内容一起加入，M1 没有日程数据。
