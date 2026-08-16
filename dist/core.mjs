const defaultLabels = {
  all: "All",
  empty: "No posts found.",
  previous: "Previous",
  next: "Next"
};
function defineBlogConfig(config) {
  return config;
}
function normalizeBasePath(path) {
  const trimmed = path.trim();
  if (!trimmed)
    return "/";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/{2,}/g, "/").replace(/\/$/, "");
  return normalized || "/";
}
function normalizeRoute(path, fallback) {
  if (path === false)
    return false;
  return normalizeBasePath(path ?? fallback);
}
function normalizeBlogConfig(options = {}) {
  const inputSections = options.sections && Object.keys(options.sections).length > 0 ? options.sections : { blog: { collection: "blog", basePath: "/blog" } };
  const sections = {};
  const registeredRoutes = /* @__PURE__ */ new Map();
  for (const [key, input] of Object.entries(inputSections)) {
    if (!/^[a-z][a-z0-9-]*$/i.test(key))
      throw new Error(`[happydesigns/blog] Invalid section key "${key}".`);
    if (!input.collection?.trim())
      throw new Error(`[happydesigns/blog] Section "${key}" needs a collection.`);
    const basePath = normalizeBasePath(input.basePath ?? `/${key}`);
    const routesDisabled = input.routes === false;
    let routeInput = {};
    if (input.routes)
      routeInput = input.routes;
    const routes = {
      index: routesDisabled ? false : normalizeRoute(routeInput?.index, basePath),
      post: routesDisabled ? false : normalizeRoute(routeInput?.post, `${basePath}/[...slug]`),
      category: routesDisabled ? false : normalizeRoute(routeInput?.category, `${basePath}/category/:category`),
      tag: routesDisabled ? false : normalizeRoute(routeInput?.tag, `${basePath}/tag/:tag`),
      author: routesDisabled ? false : normalizeRoute(routeInput?.author, `${basePath}/author/:author`)
    };
    const feed = input.feed === false ? false : {
      ...input.feed,
      rss: normalizeRoute(input.feed?.rss, `${basePath}/rss.xml`),
      atom: normalizeRoute(input.feed?.atom, `${basePath}/atom.xml`)
    };
    for (const [routeKind, route] of Object.entries({ ...routes, rss: feed && feed.rss, atom: feed && feed.atom })) {
      if (!route)
        continue;
      const owner = registeredRoutes.get(route);
      if (owner)
        throw new Error(`[happydesigns/blog] Route "${route}" is used by both ${owner} and ${key}.${routeKind}.`);
      registeredRoutes.set(route, `${key}.${routeKind}`);
    }
    sections[key] = {
      key,
      collection: input.collection,
      basePath,
      title: input.title ?? key.charAt(0).toUpperCase() + key.slice(1),
      description: input.description,
      locale: input.locale ?? "en",
      itemsPerPage: input.itemsPerPage ?? 12,
      showPreviewImages: input.showPreviewImages ?? true,
      sort: {
        field: input.sort?.field ?? "date",
        direction: input.sort?.direction ?? "DESC"
      },
      categories: input.categories ?? {},
      labels: { ...defaultLabels, ...input.labels },
      authors: input.authors ?? false,
      routes,
      feed
    };
  }
  return { sections };
}
function toTimestamp(value) {
  if (!(value instanceof Date) && typeof value !== "string")
    return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}
function isBlogPostVisible(post, now = /* @__PURE__ */ new Date()) {
  if (post.published === false || post.status === "draft")
    return false;
  const publishAt = toTimestamp(post.publishedAt);
  if (publishAt !== null && publishAt > now.getTime())
    return false;
  if (post.status === "scheduled")
    return publishAt !== null && publishAt <= now.getTime();
  return true;
}
function getBlogPostCategories(post) {
  return [.../* @__PURE__ */ new Set([
    ...post.category ? [post.category] : [],
    ...post.categories ?? []
  ])];
}
function joinBlogUrl(base, path) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export { defineBlogConfig, getBlogPostCategories, isBlogPostVisible, joinBlogUrl, normalizeBasePath, normalizeBlogConfig };
