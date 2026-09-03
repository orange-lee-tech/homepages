---
title: "Eight Weeks at IMP: From Results to Evidence"
date: 2026-08-28
---

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/imp-campus-entrance.webp" alt="Entrance to the Institute of Modern Physics campus" width="480" height="640" loading="eager" decoding="async">
  <figcaption>The Institute of Modern Physics, Chinese Academy of Sciences, where I completed the eight-week placement.</figcaption>
</figure>

<p class="post-lede">From “getting a result” to “building evidence”: how an eight-week research-engineering placement changed the way I work.</p>

Before my senior year, I completed an eight-week production-practice placement in the High-Power Beam group at the Institute of Modern Physics, CAS. The team already had a paper, FLUKA energy-deposition results, and an ANSYS engineering model. I did not own the upstream FLUKA particle-transport calculation; my role was to receive its outputs and advance the thermal-simulation interface, inherit the Fluent engineering project, verify data and power balances, diagnose CAD/meshing problems, and participate in thermal-property experiments.

By the end of the placement, the new formal model had not yet completed volume meshing, heat-source hookup, or thermal-stress solution. What had been established instead was a traceable evidence chain around the legacy heat-source path, the new data interface, key error explanations, and geometry fault localization.

## From software user to engineering handover

I started with Fluent 2D cases, minimal 3D cases, and reproduction of an existing paper before joining the existing Fluent–Mechanical project.

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/fluent-thermal-result.webp" alt="Fluent thermal result and energy-plan diagnostic" width="480" height="270" loading="lazy" decoding="async">
  <figcaption>An early thermal result and energy diagnostic: first make the chain run, then verify energy and boundaries.</figcaption>
</figure>

I could already complete modeling, meshing, boundary setup, and solver configuration, and independently checked a cooling-water flow of about 7.97 kg/s, a 0.98 °C temperature rise, and roughly 32.48 kW of heat transfer.

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/handover-status.webp" alt="Engineering handover status and key metrics" width="360" height="202" loading="lazy" decoding="async">
  <figcaption>In a complex project, the handover includes data provenance, interfaces, validation status, and unresolved boundaries—not just model files.</figcaption>
</figure>

Once I inherited the larger engineering project, the questions changed from “how do I operate the software?” to “where did this file come from, what does this UDF do, which region receives which data, and which claims have actually been verified?” GitHub gradually became a lightweight engineering-management layer for daily facts, code, validation evidence, and unresolved boundaries.

## From “the model runs” to “the result is defensible”

After restoring the legacy `.29 → Python/C → UDF → Fluent` heat-source chain, Fluent produced a temperature of about 210 °C. But a power-balance check found 46.800 kW in the complete FLUKA scoring box, 38.178 kW mapped to zones 8–11, and 37.243 kW actually loaded into the zone-10 copper region—a net gap of 18.422%.

That gap was not simply “18% of cells failed to map.” The mapped volume of zone 10 was about 99.999962%, and empty voxels represented only 0.0615% of total power. Voxel-level accounting closed about 8.621 kW of the discrepancy and showed that the main cause was geometric non-overlap between the full regular FLUKA scoring box and the actual Fluent region, with additional underfill/overfill from centroid-based discrete mapping.

The lesson was simple: **units, regions, totals, spatial mapping, and conservation come before a temperature contour.**

> A solver returning a number means the computation ended; it does not mean validation ended.

## From handling anomalies to tracing root causes

A new FLUKA grid should have contained 34,560,000 values, while `.30.lis` exposed only 14,786,930. Rather than immediately declaring the file corrupted, I parsed the raw `fort.30`, recovered the full 34.56M float32 values, and independently cross-checked count, sum, peak, and hash in Python and the Fluent UDF. At 5 mA normalization, the full-domain integrated power was 31.035 kW. Only after closing that evidence loop could we conclude that the ASCII file was a truncated prefix of the raw matrix.

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/cad-meshing-workstation.webp" alt="Inspecting CAD and meshing issues at a workstation" width="360" height="270" loading="lazy" decoding="async">
  <figcaption>The fault appeared in Fluent, but its root cause was upstream in CAD design and delivery.</figcaption>
</figure>

The CAD/Fluent Meshing work reinforced the same habit. Local 0.5 mm refinement pushed the surface mesh to about 6.31 million faces and made the symptoms spread. Further diagnosis revealed real intersections between the copper body and cooling pipes, and some spiral pipes had been merged into the same Solid as the body. TUI checks found about 79,829 and 69,515 inter-zone intersections against wall.5 and wall.6, while the healthy control wall.7 had zero. Removing suspect pipe geometry allowed Share to continue region computation.

Late in the placement, we also tested the reliability of a DRPL-V flat-plate heat-flow thermal-conductivity apparatus. Thermal expansion changed the conduction distance, indoor humidity mattered, and condensation during cooling altered contact thermal resistance. Real experiments made it clear that multiple error sources can act concurrently.

## A responsibility node in a research chain

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/thermal-conductivity-experiment.webp" alt="DRPL-V thermal-conductivity experiment" width="360" height="480" loading="lazy" decoding="async">
  <figcaption>Experimental work reinforced the need to treat equipment, environment, material state, and procedure as simultaneous sources of uncertainty.</figcaption>
</figure>

Large research systems are collaborative chains. I did not perform the upstream FLUKA transport calculation, but I still needed to understand its units, data dimensions, coordinates, and power. My downstream results also had to be delivered in a form that another person could continue from.

Research independence therefore does not mean doing every stage alone. It means making independent judgments, reviewing inputs, and validating outputs within a clear responsibility boundary.

AI reduced the cost of cross-software learning, code drafting, fault hypotheses, and information organization, but it also introduced risks of cognitive outsourcing and fluent-but-wrong explanations. My working rules became explicit: an AI explanation is not a fact, generated code is not automatically correct, and software running is not proof of physical correctness. Key judgments still require raw data, conservation checks, independent calculations, healthy controls, and A/B validation; GitHub maintains version, time, and factual boundaries.

The main weaknesses are equally clear: I was slow to decompose the early Meshing problems, and I still need stronger foundations in numerical discretization, mesh independence, uncertainty propagation, and experimental metrology.

The most important result of the eight weeks was therefore not a list of software packages. It was a more reliable work chain:

> **Complete the task → verify the result → trace the fault to its cause → ask how to prevent the same class of failure and make the next handover easier.**

<figure class="post-figure">
  <img src="static/assets/posts/2026-08-28-imp-internship-complete/hiaf-control-center.webp" alt="Outside the HIAF Control Center" width="360" height="270" loading="lazy" decoding="async">
  <figcaption>Closing the eight-week work log at the HIAF Control Center.</figcaption>
</figure>
