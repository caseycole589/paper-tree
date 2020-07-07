/* <link rel="import" href="../paper-menu-button/paper-menu-button.html"> */
/**
`<paper-tree-node>` display a tree node with expandable/collapsible capabilities and actions menu.

A node is defined by a name, an icon and a list of actions.

Example:

    <paper-tree-node></paper-tree-node>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-tree-selected-background-color`      | Highlight color for selected node           | `rgba(200, 200, 200, 0.5)`
`--paper-tree-selected-color`                 | Text and icon color for selected node       | `inherit`
`--paper-tree-toggle-theme`                   | Change theme for node +/- toggle            |
`--paper-tree-icon-theme`                     | Change theme for node icon                  |

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { LitElement, html, property } from "lit-element"
export class PaperTreeNode extends LitElement {
  render() {
    return html`
      <style>
        :host(.selected) > .node-container > .node-row {
          background-color: var(
            --paper-tree-selected-background-color,
            rgba(0, 136, 255, 0.18)
          );
          color: var(--paper-tree-selected-color, inherit);
        }

        :host(.selected) > .node-container > .node-row > #actions {
          display: inline-block;
        }

        .node-container {
          white-space: nowrap;
        }

        .node-row {
          padding-left: 4px;
          padding-right: 4px;
        }

        .node-preicon.collapsed,
        .node-preicon.expanded {
          padding-left: 0px;
        }

        .node-preicon {
          padding-left: 18px;
        }

        .node-preicon:before {
          margin-right: 5px;
          @apply (--paper-tree-toggle-theme);
        }

        .node-preicon.collapsed:before {
          content: "\\002B";
        }

        .node-preicon.expanded:before {
          content: "\\2212";
        }

        .node-preicon,
        .node-name {
          cursor: pointer;
        }

        .node-icon {
          cursor: pointer;
          width: 24px;
          height: 24px;
          @apply (--paper-tree-icon-theme);
        }

        #actions {
          display: none;
          float: right;
          padding: 0;
          top: -8px;
          /* cancel the padding of \`paper-icon-button\`. */
        }

        ul {
          margin: 0;
          padding-left: 20px;
        }

        li {
          list-style-type: none;
        }

        li.selected {
          background: aliceblue;
        }
      </style>
      <div class="node-container">
        <div class="node-row">
          <!-- <span class$="{{_computeClass(data.*)}}" on-click="toggleChildren"></span> -->
          <span class="${this.compute_class()}" @click="${this.toggleChildren}"></span>
          <iron-icon
            class="node-icon"
            .icon="${this.data.icon ? this.data.icon : `folder`}"
            @click="${this.select}"
          ></iron-icon>
          <span class="node-name" @click="${this.select}">${this.data.name}</span>
          ${this.open
            ? html`
                <ul>
                  ${this.children.map(
                    item => html`
                      <li>
                        <paper-tree-node .data="${item}"></paper-tree-node>
                      </li>
                    `
                  )}
                </ul>
              `
            : null}
        </div>
      </div>
    `
  }
  @property({ type: Object }) data: any = { children: [] }
  @property({ type: Array }) children: any = []
  @property({ type: Boolean }) open: boolean = false

  /**
   * Data hold by this node (contains the children).
   *
   * Specific data:
   *
   * - `data.name`: string representing the node name.
   * - `data.icon`: string telling which icon to use (default to 'folder' icon).
   * - `data.open`: boolean telling whether the node is expanded or not.
   * - `data.children` array containing the children of the node.
   */

  /**
   * The `select` event is fired whenever `select()` is called on the node.
   *
   * @event select
   */

  /**
   * The `toggle` event is fired whenever a tree node is expanded or collapsed.
   * This event can be used by the host to lazy load grandchildren.
   *
   * @event toggle
   */

  updated(changes) {
    if (changes.has("data") && this.data) {
      if (this.data.children) {
        this.children = this.data.children
      }
      if (this.data.open) {
        this.open = this.data.open
      }
    }
  }

  compute_class() {
    const open = this.open || false
    const children = this.children || []
    return (
      "node-preicon " +
      (open && children && children.length
        ? "expanded"
        : children && children.length
        ? "collapsed"
        : "")
    )
  }

  /**
   * Highlights node as the selected node.
   */
  select() {
    this.dispatchEvent(
      new CustomEvent("select", {
        bubbles: true,
        composed: true,
        detail: this
      })
    )
  }

  /**
   * Returns the parent tree node. Returns `null` if root.
   */
  getParent() {
    return this.tagName === "PAPER-TREE-NODE" ? this : null
  }

  /**
   * Returns the children tree nodes.
   */
  getChildren() {
    return this.shadowRoot.querySelectorAll("paper-tree-node")
  }

  /**
   * Display/Hide the children nodes.
   */
  toggleChildren() {
    this.open = !this.open && this.data.children && this.data.children.length
    this.dispatchEvent(
      new CustomEvent("toggle", {
        bubbles: true,
        composed: true,
        detail: this
      })
    )
  }
}
customElements.define("paper-tree-node", PaperTreeNode)
