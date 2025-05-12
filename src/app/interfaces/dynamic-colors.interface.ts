export interface HomePageColors {
    backgroundPrimary: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    backgroundQuaternary: string;
    textTitle: string;
    textBody: string;
}

export interface PageContentColors {
    backgroundPage: string;
    backgroundSecondary: string;
    textTitle: string;
    textBody: string;
    fontFamily: string;
    fontSizeH1: string;
    fontSizeH2: string;
    fontSizeH3: string;
    fontSizeH4: string;
    fontSizeH5: string;
    fontSizeH6: string;
    fontSizeText: string;
}

export interface PageButtonsColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}

export interface TitleNavbarColors {
    color: string;
}

export interface NavbarColors {
    background: string;
    text: string;
}
  
export interface NavbarButtonsColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}
  
export interface SidebarColors {
    background: string;
    text: string;
}

export interface SidebarButtonsColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}

export interface TabsColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}

export interface PaginationColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}

export interface FooterColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}
  
export interface ThemeColors {
    homePage: HomePageColors,
    navbar: NavbarColors;
    navbarButtons: NavbarButtonsColors;
    sidebar: SidebarColors;
    sidebarButtons: SidebarButtonsColors;
    titleNavbar: TitleNavbarColors;
    pageContent: PageContentColors;
    pageButtons: PageButtonsColors;
    tabs: TabsColors;
    pagination: PaginationColors;
    footer: FooterColors;
}
  
export interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}

export interface DynamicColors {
}
