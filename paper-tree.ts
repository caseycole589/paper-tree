import "./paper-tree-node"

import { LitElement, html, property } from "lit-element"
export class PaperTree extends LitElement {
  render() {
    return html`
      <div>
        <paper-tree-node
          id="root"
          .data="${this.data}"
          .actions="${this.actions}"
        ></paper-tree-node>
      </div>
    `
  }
  /*
   * Data hold by the root node (contains the children).
   *
   * Specific data:
   *
   * - `data.name`: string representing the node name.
   * - `data.icon`: string telling which icon to use (default to 'folder' icon).
   * - `data.open`: boolean telling whether the node is expanded or not.
   * - `data.children` array containing the children of the node.
   */
  @property({ type: Object }) data = {}
  @property({ type: Object }) selected: HTMLElement
  @property({ type: Array }) actions: [] = []

  /**
   * `actions` available for all nodes. Each action object has the following fields:
   *
   * - `action.label`: string representing the display name of the menu item.
   * - `action.event`: string which is the event name to dispatch whenever the item is clicked.
   *
   */

  firstUpdated() {
    this.addEventListener("select", this._selectNode)
  }

  /**
   * Called when the `select` event is fired from an internal node.
   *
   * @param {object} e An event object.
   */
  _selectNode(e) {
    e.stopPropagation()
    if (this.selected) {
      this.selected.classList.remove("selected")
    }

    // Only selects `<paper-tree-node>`.
    if (e.detail && e.detail.tagName === "PAPER-TREE-NODE") {
      this.selected = e.detail
      e.detail.classList.toggle("selected")
    } else {
      this.selected = null
    }
  }
}
customElements.define("paper-tree", PaperTree)
