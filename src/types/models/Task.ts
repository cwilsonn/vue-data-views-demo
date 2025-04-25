/**
 * Enum-like object representing the available task priorities.
 *
 * These priorities can be used to categorize tasks based on their importance.
 */
export const taskPriorities = {
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

/**
 * Mapping of task priorities to their corresponding badge color classes.
 *
 * These classes can be used to style priority badges in the UI.
 */
export const taskPriorityBadgeColorMap = {
  low: 'badge-info',
  medium: 'badge-warning',
  high: 'badge-error',
};

/**
 * Type representing the available task priorities.
 *
 * This type is derived from the keys of `taskPriorities`.
 */
export type TaskPriority = keyof typeof taskPriorities;

/**
 * Enum-like object representing the available task statuses.
 *
 * These statuses can be used to track the progress of a task.
 */
export const taskStatuses = {
  todo: 'todo',
  inProgress: 'inProgress',
  done: 'done',
} as const;

/**
 * Mapping of task statuses to their corresponding badge color classes.
 *
 * These classes can be used to style status badges in the UI.
 */
export const taskStatusBadgeColorMap = {
  todo: 'badge-info',
  inProgress: 'badge-warning',
  done: 'badge-success',
};

/**
 * Mapping of task statuses to their corresponding labels.
 *
 * These labels can be displayed in the UI to represent task statuses.
 */
export const taskStatusLabels = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
} as const;

/**
 * Type representing the available task statuses.
 *
 * This type is derived from the keys of `taskStatuses`.
 */
export type TaskStatus = keyof typeof taskStatuses;

/**
 * Type representing a task assignee.
 *
 * An assignee is a user responsible for completing the task.
 */
export type TaskAssignee = {
  /**
   * The unique identifier for the assignee.
   */
  id: number;

  /**
   * The name of the assignee.
   */
  name: string;

  /**
   * The email address of the assignee.
   */
  email: string;

  /**
   * Whether the assignee is currently active.
   */
  isActive: boolean;
};

/**
 * Type representing a task model.
 *
 * This type includes all the properties associated with a task.
 */
export type TaskModel = {
  /**
   * The unique identifier for the task.
   */
  id: number;

  /**
   * The title of the task.
   */
  title: string;

  /**
   * A detailed description of the task.
   */
  description?: string;

  /**
   * The priority of the task.
   */
  priority?: TaskPriority;

  /**
   * The current status of the task.
   */
  status?: TaskStatus;

  /**
   * The due date for the task, represented as an ISO date string.
   */
  dueDate: string;

  /**
   * The date the task was created, represented as an ISO date string.
   */
  createdAt: string;

  /**
   * The date the task was last updated, represented as an ISO date string.
   */
  updatedAt?: string;

  /**
   * The user assigned to the task.
   */
  assignee: TaskAssignee;

  /**
   * A list of tags associated with the task.
   */
  tags?: string[];
};

/**
 * Type representing a flattened task model.
 *
 * This type is used when the task data needs to be normalized for easier processing.
 */
export type TaskModelFlattened = {
  /**
   * The unique identifier for the task.
   */
  id: number;

  /**
   * The title of the task.
   */
  title: string;

  /**
   * A detailed description of the task.
   */
  description?: string;

  /**
   * The priority of the task.
   */
  priority?: TaskPriority;

  /**
   * The current status of the task.
   */
  status?: TaskStatus;

  /**
   * The due date for the task, represented as an ISO date string.
   */
  dueDate?: string;

  /**
   * The date the task was created, represented as an ISO date string.
   */
  createdAt: string;

  /**
   * The date the task was last updated, represented as an ISO date string.
   */
  updatedAt?: string;

  /**
   * The unique identifier of the assignee.
   */
  assigneeId: number;

  /**
   * The name of the assignee.
   */
  assigneeName: string;

  /**
   * The email address of the assignee.
   */
  assigneeEmail: string;

  /**
   * Whether the assignee is currently active.
   */
  assigneeIsActive: boolean;

  /**
   * A list of tags associated with the task.
   */
  tags?: string[];
};
