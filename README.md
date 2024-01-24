# wiki_engine_fe

![GitHub deployments](https://img.shields.io/github/deployments/petrenkoVitaliy/wiki_engine_fe/Production)

<b>Wiki_engine_fe</b> is a NextJs based frontend for [wiki_engine](https://github.com/petrenkoVitaliy/wiki_engine) application. Designed to provide flexible WYSIWYG editor for versioned articles (CRUD, version control for articles, user auth flows).

**Table of Contents:**

- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Structure](#structure)
- [Entities](#entities)
  - [Server endpoints](#server-endpoints)
  - [Styles](#styles)
  - [WYSIWYG](#wysiwyg)
- [Context](#context)
- [Data flow](#data-flow)
- [Redux structure](#redux-structure)

## Installation

### Prerequisites

- Node: [Install Node](https://nodejs.org/en)

### Setup

Standard NextJs setup:

```sh
 npm i
 npm run dev
 # - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Structure

0. [`/src`](src) => root with all top-level entities
1. [`/src/app/**`](src/app) => NextJs root folder with application routes structure

   1.1. [`/src/app/api`](src/app/api) => NextJs server [API](#server-endpoints)

2. [`/src/api`](/src/api) => API handler (wrapper)
3. [`/src/auth`](/src/auth) => Auth API handler (wrapper)
4. [`/src/context`](/src/context) => React server context description
5. [`/src/cookie`](/src/cookie) => cookie handler (wrapper)
6. [`/src/icons`](/src/icons) => used svg icons (imported & minified)
7. [`/src/redux`](/src/redux) => Redux structure
8. [`/src/components`](/src/components) => Reused "atomic" components
9. [`/src/containers`](/src/containers) => Containers' modules with inner non-reused components

## Entities

### [Server endpoints](src/app/api)

- `tweet-details`
  - -> Get tweet details from Twitter API
- `confirm`
  - -> OTP confirmation

### [Styles](src/styles)

Scss modules are used for styling
with following order:

- [reset.scss](src/styles/reset.scss)
- [layout.scss](src/app/layout.module.scss)
- page.module.scss (for some pages)
- container module <code>// example => [navbar.module.scss](src/containers/navbar/navbar.module.scss)</code>
- container's inner component module <code>// example ("Navbar" container -> "Menu" non-reused component) => [menu.module.scss](src/containers/navbar/menu/menu.module.scss)</code>
- reused components's module

  <code>// example ("Navbar" container -> "Menu" non-reused component -> "IconButton" reused component) => [icon-button.module.scss](src/components/icon-button/icon-button.module.scss)</code>

and reused modules:

- [common.scss (mixins)](src/styles/common.scss)
- [variables.scss](src/styles/variables.scss)

### [WYSIWYG](src/containers/wysiwyg/wysiwyg-editor.tsx)

Editor is base on [Slate](https://github.com/ianstormtaylor/slate) package.

Content is edited, controlled and stored inside EditorHandler class

- [EditorHandler](src/containers/wysiwyg/handlers/editor-handler/editor.handler.ts) => content handler root
  - [BlockEditorHandler](src/containers/wysiwyg/handlers/editor-handler/block-editor.handler.ts) => blocks's handler for both "simple" blocks (headings, quote, lists, alignments...) and "verbose" blocks (video, image, tweet, link...)
    - [VerboseBlockService](src/services/verbose-block/verbose-block.service.ts) => with separate handler for each verbose [block](src/services/verbose-block/block-service/blocks)
  - [MarkEditorHandler](src/containers/wysiwyg/handlers/editor-handler/mark-editor.handler.ts) => marks' handler (bold/italic/code... marks)

<i>\* All items (blocks, verbose blocks, marks) are declared in [constants](src/containers/wysiwyg/elements.ts)</i>

<i>\* Data structures are described in [types](src/containers/wysiwyg/types.ts)</i>

## [Context](src/context)

React Context is used to pass DTMs from server components to client components

1. [Context structure description](src/context/article-version-context.ts)
2. [Initialization](src/app/[article]/[language]/history/page.tsx#L38)
3. [Usage in client component](src/containers/article-history/article-content/article-content.tsx#L19)

   3.1. [data source choose <code>take data from context (on first load) or redux (on data updates)</code>](src/containers/article-history/article-content/article-content.tsx#L25)

## Data flow

1. Initially data is fetched in server component => [ArticleLanguage component example](src/app/[article]/[language]/page.tsx#L60) (here and below)

   1.1. All data is fetched via [ApiHandler](src/api/api-handler/api.handler.ts) <i>(with separate method for each api call)</i>

   1.1.1. Each call is wrapped with [FetchHandler](src/api/api-handler/fetch.handler.ts)

2. Data is passed from server components to client components using [React Context flow](#context)

   2.1. <i>There are selectors inside root client components to choose which data source to use - redux or context (if data is present in redux - use redux data, otherwise - context)</i>

3. In case there were data update (like [Article's update](src/containers/article-section/article-content/article-bar/edit-article-bar/edit-article-bar.tsx#L156)):

   3.1. Update request is sent and handled via [redux thunk](src/redux/stores/editor/editor.thunk.ts#L159)

   3.2. Data is updated in redux [slice](src/redux/stores/editor/editor.slice.ts#L44)

   3.3. Client component receives update and data is taken from redux now (2.1 step)

## Redux structure

- `editor`
  - `headings`: string[] -> table content headings
  - `isEditorEditMode`: boolean -> is edit mode
  - `article`: Article | null -> opened article
- `user`
  - `user`: User | null -> authorized user details
