---
title: Turn a community event into a useful report
description: A realistic article with results, links, media, and a project-owned content component.
date: 2026-08-13
published: true
authors:
  - jan
  - maya
category: Workflow
tags:
  - long-form
  - mdc
  - community
image:
  src: /images/blog-release.svg
  alt: A publication signal representing a community update
  width: 1200
  height: 675
---

A community website often needs more than a short announcement. A useful recap combines narrative, structured results, supporting media, and links that remain understandable after the event is over.

## The story comes first

Twenty-four participants joined the summer workshop for an afternoon of short talks, practical sessions, and an open showcase. The report records the outcome without turning Blog into an events or tournament system.

::tip
Connect the article to a project-owned event through an optional schema field. The event remains structured data; the article remains editorial context.
::

## Results at a glance

Markdown tables cover compact, readable results without requiring a special component.

| Session | Participants | Outcome |
| --- | ---: | --- |
| Publishing basics | 9 | First article published |
| Media workshop | 8 | Shared gallery assembled |
| Feed clinic | 7 | RSS validated |

For larger or interactive datasets, the consuming application can register a dedicated results component and keep its schema outside Blog.

## Impressions from the day

The gallery below is a **playground-owned MDC component**. Blog only passes the content document to Nuxt Content, so another application can provide a lightbox, carousel, diagram, chessboard, or any other domain-specific renderer.

::content-gallery
---
items:
  - src: /images/blog-architecture.svg
    alt: Layered cards illustrating the opening session
    caption: The opening session mapped content, publication behavior, and presentation.
  - src: /images/blog-content.svg
    alt: Colorful content blocks from the media workshop
    caption: Participants composed reusable content blocks for different projects.
  - src: /images/blog-workflow.svg
    alt: Connected stages representing the final publishing workflow
    caption: Draft, review, and publication stayed visible throughout the exercise.
---
::

## Continue reading

- Read why [content models should compose](/blog/composable-content).
- Compare the separate [release notes publication](/news).
- Open the [RSS feed](/blog/rss.xml) used by feed readers.

This example uses only fictional editorial content. Its structure mirrors real needs without moving customer-specific data or components into the capability.
