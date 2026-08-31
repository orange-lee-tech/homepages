---
title: "AI Video Director: Capability Boundaries and Product Validation"
date: 2026-08-30
---

<p class="post-lede">In August 2026 I stopped asking the vague question “can AI edit video?” and started breaking it into engineering questions that can actually be tested. By August 30, the project had reached v0.1.3 and entered real Windows Human Gate validation.</p>

## The goal is not an AI-editing demo

The product is local-first and centered on user-supplied footage. It is not a generic text-to-video system and it does not silently download or generate missing visual coverage.

Missing footage should remain visible as a product fact.

Two core paths define the system:

**Planning:** Brief → ScriptPlan → ShootingPlan

**Editing:** local footage → understanding/evidence → Director/EditPlan → Resolver → EDL → Renderer → Review → MP4

Planning and Editing can work independently or together. Ordinary users should not have to hand-author internal Domain objects or EDL data.

## AI proposes; evidence owns facts

The most important boundary is authority.

A model may propose editorial choices, but it cannot invent source timestamps, shot facts, or final timeline placement.

The project therefore treats model output as a proposal, the EDL as the sole executable timeline authority, and the renderer as an executor rather than a hidden decision-maker.

## Product validation is different from code validation

Automated tests can prove machinery, but they do not prove that a Windows user can install, update, recover from failures, handle provider quotas, and complete a real editing path.

Human Gate testing exposed precisely those less glamorous issues: installer behavior, update flow, dirty test workspaces, Gemini quota failures, unsupported claims, and deterministic recovery.

By August 30 the mainline had advanced to v0.1.3, but the project remains in Stage A structural construction and product validation.

## Capability boundaries are a result

The project keeps reinforcing one principle:

> **Unverifiable automation is not more advanced automation.**

Language models should own what they are good at: intent, reasoning, and candidate proposals. Structured data and deterministic code should own timestamps, evidence, and execution. Human gates should remain where uncertainty is real.

## Software-copyright preparation

I have also begun organizing versions, source code, documentation, installers, and release assets for a Chinese software-copyright application.

This is preparation, not a granted right. The process is useful because it forces the software name, version, code structure, documentation, and product boundary to agree.

Repository: <https://github.com/orange-lee-tech/video-editing-agent>
