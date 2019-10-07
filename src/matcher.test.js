import { matcher } from './matcher';

let patterns;
describe("Matcher evaluation", () => {
  beforeEach(() => {
    patterns = [
        { path: '/info', id: 0 },
        { path: '/info/:type/search', id: 1 },
        { path: '/info/foo/search', id: 2 },
        { path: '/:some/:properties', id: 3 },
        { path: '/other/:properties', id: 4 },
        { path: '*', id: 99 }
    ];
  });

  test("Matching", () => {
    expect(matcher(patterns, '/info').route.id).toBe(0);
    expect(matcher(patterns, '/info/foo').route.id).toBe(99);   
  });

  test("Top level", () => {
    // Top level routes cannot be dynamic
    // Wildcard is applied when no routes are matched
    expect(matcher(patterns, '/some/props').route.id).toBe(99);
    expect(matcher(patterns, '/other/url').props.properties).toBe('url');
  })

  test("Dynamic vs. Exact", () => {
    // Exact matches always have precedence over dynamic routes
    expect(matcher(patterns, '/info/foo/search').route.id).toBe(2);
    // This is dynamically matched
    expect(matcher(patterns, '/info/bar/search').route.id).toBe(1);
  })
});
