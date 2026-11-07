# Changelog

## 2026-11-06

- 计划更新并实施：页眉背景换成用户提供的两张樱花图并交替显示，去掉大脑图；删除 Student Support 版块和 3 个页眉按钮（Travel Award Application、Travel Info、ASA/SDSI special issue）；参考历届 SMI 重写页面文字，不再沿用 2026 原文。经用户确认后发布。
- 计划更新：Hongtu Zhu 已确认担任 Keynote（用户告知）。
- 计划更新并实施：Important Dates 按 2026 日期加一年填写；网站上线日期（加一年后为 2026 年 9 月，已过）改为 November 2026。短课程截止日期按 2026 日期表的 March 01（2026 版块里的 March 20 是未同步的旧值）。
- 计划更新：改为严格沿用 SMI 2026 的单页版式和 tab；写入会议日期、会场、酒店、Keynote、页眉图片和联系人要求。
- 按 2026 结构重建为单页：7 个导航项、4 个日程 tab、相同版块顺序，配色改为 UMD。移除上一版的多页和 Past Meetings。构建前自动清空 `_site`；外部链接检查把 401/403/429 列为需人工核对。经用户确认后发布。

## 2026-11-04

- 新建 `doc/plan.md` 草案：分析 SMI 2026 参考站，提出托管、技术栈、页面结构、里程碑、验收标准和待确认决策。尚未开始写网站代码，也未创建仓库。
- 计划更新：确认 Eleventy + YAML 和页面结构；开始本地实现 M1。主办方确认前保持草稿模式（提示条 + `noindex`）。仓库归属未定，暂不部署。
- 完成 M1 本地版：5 个页面、YAML 内容文件、数据校验、链接检查、部署 workflow、README。smoke 和外部链接检查通过。部署 workflow 尚未实际运行。
- Past Meetings：2023 和 2019 的原链接分别返回 404 和 410，已去掉链接，只保留文字。
- 计划更新：仓库先放个人账号 `waterism211/smi-2027`（公开仓库），用 GitHub Actions 部署草稿版。
- 已创建公开仓库并部署草稿版到 https://waterism211.github.io/smi-2027/ ，部署 workflow 运行成功。
