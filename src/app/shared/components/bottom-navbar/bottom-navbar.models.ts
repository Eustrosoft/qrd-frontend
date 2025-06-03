import { Icon } from '@app/app.models';

export type BottomNavbarLink = {
  icon: Icon;
  iconActive?: Icon;
  route: string;
  title: string;
};
