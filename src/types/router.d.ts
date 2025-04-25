// Third-party
import 'vue-router'

declare module 'vue-router' {
  /**
   * Custom route meta type for Vue Router to add additional metadata properties.
   */
  interface RouteMeta {
    title?: string
    icon?: string
  }
}
