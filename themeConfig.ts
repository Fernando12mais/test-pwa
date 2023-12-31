import { breakpointsVuetify } from '@vueuse/core';

import { VIcon } from 'vuetify/components';

// ❗ Logo SVG must be imported with ?raw suffix
import logo from '@images/logo.png';

import { defineThemeConfig } from '@core';
import { RouteTransitions, Skins } from '@core/enums';
import {
  AppContentLayoutNav,
  ContentWidth,
  FooterType,
  NavbarType,
} from '@layouts/enums';

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    title: 'ERP',
    logo: h('img', {
      src: logo,
      style:
        'line-height:0; color: rgb(var(--v-global-theme-primary)); width:6rem;',
    }),
    contentWidth: ContentWidth.Boxed,
    contentLayoutNav: AppContentLayoutNav.Horizontal,
    overlayNavFromBreakpoint: breakpointsVuetify.md + 16, // 16 for scrollbar. Docs: https://next.vuetifyjs.com/en/features/display-and-platform/
    enableI18n: true,
    theme: 'light',
    isRtl: false,
    skin: Skins.Default,
    routeTransition: RouteTransitions.Fade,
    iconRenderer: VIcon,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.None },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: 'tabler-circle', size: 10 },
    isVerticalNavSemiDark: false,
  },
  horizontalNav: {
    type: 'sticky',
    transition: 'slide-y-reverse-transition',
  },
  icons: {
    chevronDown: { icon: 'tabler-chevron-down' },
    chevronRight: { icon: 'tabler-chevron-right', size: 18 },
    close: { icon: 'tabler-x' },
    verticalNavPinned: { icon: 'tabler-circle-dot' },
    verticalNavUnPinned: { icon: 'tabler-circle' },
    sectionTitlePlaceholder: { icon: 'tabler-separator' },
  },
});
