/**
 * Props for the PageBase component.
 *
 * This type defines the properties that can be passed to the PageBase component,
 * including the page title and an optional icon.
 */
export type PageBaseProps = {
  /**
   * The title of the page.
   *
   * If not provided, the title will be derived from the route's metadata.
   */
  title?: string;

  /**
   * The icon to display alongside the page title.
   *
   * If not provided, the icon will be derived from the route's metadata.
   */
  icon?: string;
};

/**
 * Slots for the PageBase component.
 *
 * This type defines the named slots available in the PageBase component,
 * including slots for customizing the title icon, title text, and summary.
 */
export type PageBaseSlots = {
  /**
   * Slot for customizing the icon displayed alongside the page title.
   *
   * Props:
   * - `icon`: The icon to display.
   */
  'title-icon': { icon: string | undefined };

  /**
   * Slot for customizing the text of the page title.
   *
   * Props:
   * - `title`: The title of the page.
   */
  'title-text': { title: string | undefined };

  /**
   * Slot for adding a summary or description below the page title.
   */
  'summary': {};

  /**
   * Default slot for adding content to the main body of the page.
   */
  'default': {};
};
