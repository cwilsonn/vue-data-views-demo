/**
 * Props for the FormInput component.
 *
 * This type defines the base properties for a form input element,
 * including common attributes such as `id`, `name`, and `placeholder`.
 */
export type FormInputProps = {
  /**
   * The unique identifier for the input element.
   *
   * This is required to associate the input with a label.
   */
  id: string;

  /**
   * The name of the input element.
   *
   * This is used when submitting form data.
   */
  name?: string;

  /**
   * The placeholder text displayed inside the input field.
   *
   * Example: 'Enter your name'
   */
  placeholder?: string;

  /**
   * The type of the input element.
   * 
   * NOTE: only 'text' and 'number' are supported for now due to the narrow
   * scope of this demo project. In a production environment, these would
   * be expanded to include other types such as 'email', 'password', etc.
   */
  type?: 'text' | 'number';

  /**
   * The size of the input element.
   *
   * Supported sizes: 'xs', 'sm', 'md', 'lg', 'xl'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the input is required.
   *
   * If true, the input must be filled before the form can be submitted.
   */
  required?: boolean;

  /**
   * Whether the input is disabled.
   *
   * If true, the input will be non-interactive.
   */
  disabled?: boolean;
};
