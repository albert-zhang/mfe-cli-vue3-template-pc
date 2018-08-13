declare interface SideMenu {
  path: string;
  icon: string;
  name: string;
  text: string;
  hidden: boolean;
  children?: SideMenu[];
}
