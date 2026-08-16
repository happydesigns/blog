---
title: Design the publishing workflow around people
description: Drafts, scheduled content and feeds are most useful when they stay understandable.
date: 2026-08-12
published: true
authors:
  - jan
  - maya
category: Workflow
tags:
  - workflow
  - publishing
image:
  src: /images/blog-workflow.svg
  alt: A flowing editorial timeline with three connected stages
  width: 1200
  height: 675
---

Publishing systems become valuable when authors can predict what happens next.

Clear states and conservative defaults matter more than adding another layer of hidden automation.

## The public contract

| Editorial state | Public result |
| --- | --- |
| `published: false` | Hidden everywhere |
| `status: draft` | Hidden everywhere |
| `status: scheduled` with a future date | Hidden until its publication time |
| `status: published` | Visible unless its publication date is still in the future |

::warning
Static sites need a new build after a scheduled publication time. The capability cannot publish a new static page without a deployment.
::

## A workflow people can explain

1. An author writes normal Markdown and adds structured frontmatter.
2. A reviewer checks the preview supplied by the application.
3. Publication metadata decides when the document joins routes and feeds.
4. Readers receive the same visible set in archives, direct links, RSS, and Atom.

This deliberately leaves preview authorization and approval workflows with the application. A query parameter alone must never grant access to a draft.

## Useful output beyond the page

Feeds reuse the title, description, publication date, author, and canonical route from the same document. Category and author archives apply the same visibility rule, so editors do not have to reconcile several subtly different lists.

The playground includes a scheduled document dated in 2099. It is present in the content source but absent from the public archive and feeds.
