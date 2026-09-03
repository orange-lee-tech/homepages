---
title: "中國科學院近代物理研究所 8 週工作志"
date: 2026-08-28
---

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/imp-campus-entrance.webp?v=20260903-2" alt="中國科學院近代物理研究所園區入口" width="480" height="640" loading="eager" decoding="async">
  <figcaption>八週實習所在的中國科學院近代物理研究所。</figcaption>
</figure>

<p class="post-lede">從「得到結果」到「建立證據」：一次科研工程實踐中的能力演進。</p>

在進入大四前的這個暑假，我進入中國科學院近代物理研究所高功率束流室完成了 8 週生產實習。團隊已有論文、FLUKA 能量沉積結果和 ANSYS 工程模型；本人基於上游 FLUKA 粒子輸運計算，負責接住其輸出，推進熱工模擬接口、Fluent 工程繼承、數據與功率驗證、CAD/網格診斷及部分熱物性實驗。

實習結束時，新版正式模型尚未完成體網格、熱源掛接和熱應力求解；但舊熱源鏈、新數據接口、關鍵誤差解釋和幾何故障定位已經形成可追溯證據。能力變化也由此變得清晰：從「把軟件跑起來」，逐步轉向「證明結果為什麼可信」。

## 從軟件使用者，到工程接手者

自學起點依次是 Fluent 二維、三維最小案例和已有論文復現，之後加入已有 Fluent—Mechanical 工程。

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/fluent-thermal-result.webp?v=20260903-2" alt="Fluent 熱工結果與能量計劃診斷頁面" width="480" height="270" loading="lazy" decoding="async">
  <figcaption>早期工程熱工結果與能量計劃診斷：先把計算鏈跑通，再逐項核對能量與邊界。</figcaption>
</figure>

早期已經能夠完成建模、網格、邊界和求解設置，並獨立核算冷卻水約 7.97 kg/s、溫升 0.98 ℃、換熱約 32.48 kW。

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/handover-status.webp?v=20260903-2" alt="工程繼承進度與關鍵指標狀態頁" width="360" height="202" loading="lazy" decoding="async">
  <figcaption>複雜工程真正需要接手的，不只是模型文件，還包括數據來源、接口邏輯、驗證狀態與尚未閉合的邊界。</figcaption>
</figure>

真正接手複雜工程後，困難迅速從「軟件怎麼操作」變成「文件從哪裏來、UDF 做了什麼、哪個區域加載了什麼數據、哪些結論已經驗證」。這既暴露了自身複雜模擬經驗不足，也暴露了舊工程在接口說明和狀態交接上的不足。GitHub 因此逐漸從日誌倉庫變成輕量級工程管理工具，持續固化每日事實、代碼、驗證結果和未完成邊界。

## 從「模型能跑」，到「結果必須可信」

舊 `.29 → Python/C → UDF → Fluent` 熱源鏈恢復後，Fluent 已經能給出約 210 ℃ 的溫度結果。但繼續核算發現：

- FLUKA 完整計分盒功率：46.800 kW；
- zones 8–11 映射功率：38.178 kW；
- 真正加載在 zone 10 銅區的功率：37.243 kW；
- 相對完整計分盒存在 18.422% 的淨缺口。

直覺上可以把它解釋為「18% 的單元沒有映射」，但 zone 10 映射體積約 99.999962%，空體素只佔總功率 0.0615%。逐體素收支最終把缺口閉合為約 8.621 kW：主因是 FLUKA 完整規則計分盒與 Fluent 實際幾何區域並不完全重合；同時，基於單元質心的離散映射還會造成逐體素欠填充和過填充。兩者共同導致完整 FLUKA 盒積分功率與 Fluent 映射功率不一致。

這一階段真正發生的變化，不是多寫了幾個 UDF，而是開始把**單位、區域、總量、空間映射和守恆**放在溫度雲圖之前。

> **求解器給出數值，只說明計算結束，不說明驗證結束。**

## 從處理異常，到追溯根因

新 FLUKA 網格理論應有 34,560,000 個數據，而 `.30.lis` 只讀到 14,786,930 個。最初只記錄異常，沒有立即判定文件損壞；隨後直接解析原始 `fort.30`，找到完整 34.56M 個 float32，並由 Python 與 Fluent UDF 獨立核對數量、總和、峰值和 Hash。按 5 mA 歸一化後，全域積分功率為 31.035 kW。證據閉合後，才能確認 ASCII 文件只是原始矩陣的截斷前綴。

這使我形成了一個更嚴格的認識：**輸入文件同樣不是天然事實，數據來源和完整性也需要驗證。**

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/cad-meshing-workstation.webp?v=20260903-2" alt="在工作站檢查 CAD 與網格問題" width="360" height="270" loading="lazy" decoding="async">
  <figcaption>CAD / Fluent Meshing 排障：故障表現在 Fluent，根因卻可能位於更上游的幾何設計與交付。</figcaption>
</figure>

CAD/Fluent Meshing 排障進一步把工作方式從「調參數」推向「追根因」。0.5 mm 局部加密使表面網格增至約 631 萬面，問題反而擴散；隨後發現銅體與冷卻管存在真實穿模，部分螺旋管還與主體被合併為同一 Solid。TUI 診斷中，主體與 wall.5、wall.6 分別存在約 79,829 和 69,515 個 inter-zone intersection，而健康對照 wall.7 為 0。刪除可疑管路後，Share 能夠繼續完成 region computation。

故障表現在 Fluent，根因卻位於上游 CAD 設計與交付。這使我開始把模擬排障理解為一種科研工程「運維」：不僅修當前故障，還要追問設計交付、接口驗收和配置管理為什麼沒有更早阻斷問題。

實習後期，我們還對 DRPL-V 平板熱流計導熱係數測定設備做了大量實驗，以檢驗其可信度與精準度。實驗中發現，加熱會引起被測物熱膨脹、改變導熱距離；室內濕度也不可忽略，冷卻過程中熱面會出現明顯凝水，水焓會進一步影響接觸熱阻。真實實驗環境中的問題往往多維併發，因此變量控制和計量意識比理想條件下更苛刻。

## 從獨立個體，到科研協作鏈中的責任節點

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/thermal-conductivity-experiment.webp?v=20260903-2" alt="DRPL-V 平板熱流計導熱係數實驗設備" width="360" height="480" loading="lazy" decoding="async">
  <figcaption>熱物性實驗讓我再次看到：真實系統中的誤差來源往往同時來自設備、環境、材料狀態與操作過程。</figcaption>
</figure>

大型科研不是一個人完成全部環節。本人不負責 FLUKA 粒子輸運計算，但仍必須理解上游輸出的單位、數據規模、坐標和功率；同樣，下游結果也必須以別人能夠繼續使用的形式交付。

科研獨立性並不是「什麼都自己做」，而是在明確職責邊界內獨立判斷、審查輸入、驗證輸出。一個科研系統的可靠性，還取決於接口是否明確、數據是否可追溯、設計交付是否規範、人員更替後知識能否繼續傳遞。

AI 在本項目中顯著降低了跨軟件學習、代碼草擬、故障假設和信息整理成本，也使高密度日誌成為可能；但它同樣可能造成認知外包、流暢性誤導和錯誤方向的效率放大。項目後期形成的約束很明確：

- AI 提出解釋，不等於事實成立；
- AI 生成代碼，不等於程序正確；
- 軟件正常運行，也不等於物理正確；
- 關鍵判斷仍需原始數據、守恆關係、獨立計算、健康對照和 A/B 驗證；
- GitHub 負責維持版本、時間和事實邊界。

從兩個月的過程看，我已經形成了更強的陌生工程接手、數據驗證和故障診斷意識。研究所老師關於「學習較快、能夠深入問題和獨立處理任務」的直觀評價與此基本一致；不足也同樣明確：前期 Meshing 問題分層較慢，數值離散、網格無關性、不確定度傳播和實驗計量學基礎仍需補強。

下一階段不應越過團隊分工去替代上游 FLUKA 工作，而應繼續深化熱流體與多物理場數值方法，完善守恆型映射、模型驗收、變更回歸和實驗不確定度。

八週實習留下的核心變化，不是掌握了多少軟件，而是形成了一條更可靠的工作鏈：

> **從完成任務，到驗證結果；從定位故障，到追問系統為何產生故障；再到考慮怎樣讓同類問題更少發生，讓下一位接手者不必重新考古。**

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/hiaf-control-center.webp?v=20260903-3" alt="HIAF 中央控制樓前留影" width="360" height="270" loading="lazy" decoding="async">
  <figcaption>八週工作志的收尾：HIAF 中央控制樓。</figcaption>
</figure>
