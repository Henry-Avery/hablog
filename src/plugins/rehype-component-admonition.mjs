/// <reference types="mdast" />
import { h } from 'hastscript';
import { visit } from 'unist-util-visit';

/**
 * Creates an admonition component.
 */
function AdmonitionComponent(properties, children, type) {
  if (!Array.isArray(children) || children.length === 0)
    return h(
      'div',
      { class: 'hidden' },
      'Invalid admonition directive.'
    );

  let label = null;
  if (properties?.['has-directive-label']) {
    label = children[0];
    children = children.slice(1);
    if (label) label.tagName = 'div';
  }

  return h('div', { class: `callout callout-${type}` }, [
    h('div', { class: 'callout-title' }, label ? label.children : type.toUpperCase()),
    ...children,
  ]);
}

/**
 * Rehype plugin to transform directive nodes into admonition components
 */
export function rehypeAdmonition() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const types = ['note', 'tip', 'important', 'warning', 'caution'];
        const type = node.name?.toLowerCase();

        if (types.includes(type)) {
          const data = node.data || (node.data = {});
          const admonition = AdmonitionComponent(
            node.attributes,
            node.children,
            type
          );

          // Replace node with the admonition
          Object.assign(node, admonition);
        }
      }
    });
  };
}
