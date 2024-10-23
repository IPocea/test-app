import { Observable } from 'rxjs';

export enum NotificationType {
  Blank,
  Success,
  Error,
}

export type Notification = NewNotification & {
  id: string;
};

export type NewNotification = {
  title: string;
  message?: string;
  type: NotificationType;
};
