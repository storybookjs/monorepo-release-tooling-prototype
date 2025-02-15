import React from 'react';
import { Global, keyframes } from '@junk-temporary-prototypes/theming';
import type { Theme, CSSObject } from '@junk-temporary-prototypes/theming';

const hsResizeObserverDummyAnimation = keyframes`0%{z-index:0}to{z-index:-1}`;

export const getScrollAreaStyles: (theme: Theme) => CSSObject = (theme: Theme) => ({
  'html.os-html, html.os-html>.os-host': {
    display: 'block',
    overflow: 'hidden',
    boxSizing: 'border-box',
    height: '100%!important' as any as '100%',
    width: '100%!important' as any as '100%',
    minWidth: '100%!important' as any as '100%',
    minHeight: '100%!important' as any as '100%',
    margin: '0!important' as any as 0,
    position: 'absolute!important' as any as 'absolute',
  },
  'html.os-html>.os-host>.os-padding': {
    position: 'absolute',
  },
  'body.os-dragging, body.os-dragging *': {
    cursor: 'default',
  },
  '.os-host, .os-host-textarea': {
    position: 'relative',
    overflow: 'visible!important' as any as 'visible',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  '.os-host-flexbox': {
    overflow: 'hidden!important' as any as 'hidden',
    display: 'flex',
  },
  '.os-host-flexbox>.os-size-auto-observer': {
    height: 'inherit!important' as any as 'inherit',
  },
  '.os-host-flexbox>.os-content-glue': {
    flexGrow: 1,
    flexShrink: 0,
  },
  '.os-host-flexbox>.os-size-auto-observer, .os-host-flexbox>.os-content-glue': {
    minHeight: 0,
    minWidth: 0,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  '#os-dummy-scrollbar-size': {
    position: 'fixed',
    opacity: 0,
    visibility: 'hidden',
    overflow: 'scroll',
    height: 500,
    width: 500,
  },
  '#os-dummy-scrollbar-size>div': {
    width: '200%',
    height: '200%',
    margin: 10,
  },
  '#os-dummy-scrollbar-size, .os-viewport': {},
  '.os-viewport-native-scrollbars-invisible#os-dummy-scrollbar-size, .os-viewport-native-scrollbars-invisible.os-viewport':
    {
      scrollbarWidth: 'none!important' as any as 'none',
    },
  '.os-viewport-native-scrollbars-invisible#os-dummy-scrollbar-size::-webkit-scrollbar, .os-viewport-native-scrollbars-invisible.os-viewport::-webkit-scrollbar, .os-viewport-native-scrollbars-invisible#os-dummy-scrollbar-size::-webkit-scrollbar-corner, .os-viewport-native-scrollbars-invisible.os-viewport::-webkit-scrollbar-corner':
    {
      display: 'none!important' as any as 'none',
      width: '0!important' as any as 0,
      height: '0!important' as any as 0,
      visibility: 'hidden!important' as any as 'hidden',
      background: '0 0!important',
    },
  '.os-content-glue': {
    boxSizing: 'inherit',
    maxHeight: '100%',
    maxWidth: '100%',
    width: '100%',
    pointerEvents: 'none',
  },
  '.os-padding': {
    boxSizing: 'inherit',
    direction: 'inherit',
    position: 'absolute',
    overflow: 'visible',
    padding: 0,
    margin: 0,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: 'auto!important' as any as 'auto',
    height: 'auto!important' as any as 'auto',
    zIndex: 1,
  },
  '.os-host-overflow>.os-padding': {
    overflow: 'hidden',
  },
  '.os-viewport': {
    direction: 'inherit!important' as any as 'inherit',
    boxSizing: 'inherit!important' as any as 'inherit',
    resize: 'none!important' as any as 'none',
    outline: '0!important' as any as 0,
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 0,
    margin: 0,
  },
  '.os-content-arrange': {
    position: 'absolute',
    zIndex: -1,
    minHeight: 1,
    minWidth: 1,
    pointerEvents: 'none',
  },
  '.os-content': {
    direction: 'inherit',
    boxSizing: 'border-box!important' as any as 'border-box',
    position: 'relative',
    display: 'block',
    height: '100%',
    width: '100%',
    visibility: 'visible',
  },
  '.os-content:before, .os-content:after': {
    content: "''",
    display: 'table',
    width: 0,
    height: 0,
    lineHeight: 0,
    fontSize: 0,
  },
  '.os-content>.os-textarea': {
    boxSizing: 'border-box!important' as any as 'border-box',
    direction: 'inherit!important' as any as 'inherit',
    background: '0 0!important',
    outline: '0 transparent!important',
    overflow: 'hidden!important' as any as 'hidden',
    position: 'absolute!important' as any as 'absolute',
    display: 'block!important' as any as 'block',
    top: '0!important' as any as 0,
    left: '0!important' as any as 0,
    margin: '0!important' as any as 0,
    borderRadius: '0!important' as any as 0,
    float: 'none!important' as any as 'none',
    filter: 'none!important' as any as 'none',
    border: '0!important' as any as 0,
    resize: 'none!important' as any as 'none',
    transform: 'none!important' as any as 'none',
    maxWidth: 'none!important' as any as 'none',
    maxHeight: 'none!important' as any as 'none',
    boxShadow: 'none!important' as any as 'none',
    perspective: 'none!important' as any as 'none',
    opacity: '1!important' as any as 1,
    zIndex: '1!important' as any as 1,
    clip: 'auto!important' as any as 'auto',
    verticalAlign: 'baseline!important' as any as 'baseline',
    padding: 0,
  },
  '.os-host-rtl>.os-padding>.os-viewport>.os-content>.os-textarea': {
    right: '0!important' as any as 0,
  },
  '.os-content>.os-textarea-cover': {
    zIndex: -1,
    pointerEvents: 'none',
  },
  '.os-content>.os-textarea[wrap=off]': {
    whiteSpace: 'pre!important' as any as 'pre',
    margin: '0!important' as any as 0,
  },
  '.os-text-inherit': {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontStyle: 'inherit',
    fontVariant: 'inherit',
    textTransform: 'inherit',
    textDecoration: 'inherit',
    textIndent: 'inherit',
    textAlign: 'inherit',
    textShadow: 'inherit',
    textOverflow: 'inherit',
    letterSpacing: 'inherit',
    wordSpacing: 'inherit',
    lineHeight: 'inherit',
    unicodeBidi: 'inherit',
    direction: 'inherit',
    color: 'inherit',
    cursor: 'text',
  },
  '.os-resize-observer, .os-resize-observer-host': {
    boxSizing: 'inherit',
    display: 'block',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,
  },
  '.os-resize-observer-host': {
    padding: 'inherit',
    border: 'inherit',
    borderColor: 'transparent',
    borderStyle: 'solid',
    boxSizing: 'border-box',
  },
  '.os-resize-observer-host:after': {
    content: "''",
  },
  '.os-resize-observer-host>.os-resize-observer, .os-resize-observer-host:after': {
    height: '200%',
    width: '200%',
    padding: 'inherit',
    border: 'inherit',
    margin: 0,
    display: 'block',
    boxSizing: 'content-box',
  },
  '.os-resize-observer.observed, object.os-resize-observer': {
    boxSizing: 'border-box!important' as any as 'border-box',
  },
  '.os-size-auto-observer': {
    boxSizing: 'inherit!important' as any as 'inherit',
    height: '100%',
    width: 'inherit',
    maxWidth: 1,
    position: 'relative',
    float: 'left',
    maxHeight: 1,
    overflow: 'hidden',
    zIndex: -1,
    padding: 0,
    margin: 0,
    pointerEvents: 'none',
    flexGrow: 'inherit',
    flexShrink: 0,
    flexBasis: 0,
  },
  '.os-size-auto-observer>.os-resize-observer': {
    width: '1000%',
    height: '1000%',
    minHeight: 1,
    minWidth: 1,
  },
  '.os-resize-observer-item': {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: -1,
    opacity: 0,
    direction: 'ltr!important' as any as 'ltr',
    flex: 'none!important' as any as 'none',
  },
  '.os-resize-observer-item-final': {
    position: 'absolute',
    left: 0,
    top: 0,
    transition: 'none!important' as any as 'none',
    flex: 'none!important' as any as 'none',
  },
  '.os-resize-observer': {
    animationDuration: '.001s',
    animationName: `${hsResizeObserverDummyAnimation}`,
  },
  '.os-host-transition>.os-scrollbar, .os-host-transition>.os-scrollbar-corner': {
    transition: 'opacity .3s,visibility .3s,top .3s,right .3s,bottom .3s,left .3s',
  },
  'html.os-html>.os-host>.os-scrollbar': {
    position: 'absolute',
    zIndex: 999999,
  },
  '.os-scrollbar, .os-scrollbar-corner': {
    position: 'absolute',
    opacity: 1,
    zIndex: 1,
  },
  '.os-scrollbar-corner': {
    bottom: 0,
    right: 0,
    height: 10,
    width: 10,
    backgroundColor: 'transparent',
  },
  '.os-scrollbar': {
    pointerEvents: 'none',
    padding: 2,
    boxSizing: 'border-box',
    background: 0,
  },
  '.os-scrollbar-track': {
    pointerEvents: 'auto',
    position: 'relative',
    height: '100%',
    width: '100%',
    padding: '0!important' as any as 0,
    border: '0!important' as any as 0,
  },
  '.os-scrollbar-handle': {
    pointerEvents: 'auto',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  '.os-scrollbar-handle-off, .os-scrollbar-track-off': {
    pointerEvents: 'none',
  },
  '.os-scrollbar.os-scrollbar-unusable, .os-scrollbar.os-scrollbar-unusable *': {
    pointerEvents: 'none!important' as any as 'none',
  },
  '.os-scrollbar.os-scrollbar-unusable .os-scrollbar-handle': {
    opacity: '0!important' as any as 0,
  },
  '.os-scrollbar-horizontal': {
    bottom: 0,
    left: 0,
    right: 10,
    height: 10,
  },
  '.os-scrollbar-vertical': {
    top: 0,
    right: 0,
    bottom: 10,
    width: 10,
  },
  '.os-host-rtl>.os-scrollbar-horizontal': {
    right: 0,
  },
  '.os-host-rtl>.os-scrollbar-vertical': {
    right: 'auto',
    left: 0,
  },
  '.os-host-rtl>.os-scrollbar-corner': {
    right: 'auto',
    left: 0,
  },
  '.os-scrollbar-auto-hidden, .os-padding+.os-scrollbar-corner, .os-host-resize-disabled.os-host-scrollbar-horizontal-hidden>.os-scrollbar-corner, .os-host-scrollbar-horizontal-hidden>.os-scrollbar-horizontal, .os-host-resize-disabled.os-host-scrollbar-vertical-hidden>.os-scrollbar-corner, .os-host-scrollbar-vertical-hidden>.os-scrollbar-vertical, .os-scrollbar-horizontal.os-scrollbar-auto-hidden+.os-scrollbar-vertical+.os-scrollbar-corner, .os-scrollbar-horizontal+.os-scrollbar-vertical.os-scrollbar-auto-hidden+.os-scrollbar-corner, .os-scrollbar-horizontal.os-scrollbar-auto-hidden+.os-scrollbar-vertical.os-scrollbar-auto-hidden+.os-scrollbar-corner':
    {
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  '.os-scrollbar-corner-resize-both': {
    cursor: 'nwse-resize',
  },
  '.os-host-rtl>.os-scrollbar-corner-resize-both': {
    cursor: 'nesw-resize',
  },
  '.os-scrollbar-corner-resize-horizontal': {
    cursor: 'ew-resize',
  },
  '.os-scrollbar-corner-resize-vertical': {
    cursor: 'ns-resize',
  },
  '.os-dragging .os-scrollbar-corner.os-scrollbar-corner-resize': {
    cursor: 'default',
  },
  '.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden>.os-scrollbar-vertical': {
    top: 0,
    bottom: 0,
  },
  '.os-host-resize-disabled.os-host-scrollbar-vertical-hidden>.os-scrollbar-horizontal, .os-host-rtl.os-host-resize-disabled.os-host-scrollbar-vertical-hidden>.os-scrollbar-horizontal':
    {
      right: 0,
      left: 0,
    },
  '.os-scrollbar:hover, .os-scrollbar-corner.os-scrollbar-corner-resize': {
    opacity: '1!important' as any as 1,
    visibility: 'visible!important' as any as 'visible',
  },
  '.os-scrollbar-corner.os-scrollbar-corner-resize': {
    backgroundImage:
      'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0)  50%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.4) 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '100% 100%',
    pointerEvents: 'auto!important' as any as 'auto',
  },
  '.os-host-rtl>.os-scrollbar-corner.os-scrollbar-corner-resize': {
    transform: 'scale(-1,1)',
  },
  '.os-host-overflow': {
    overflow: 'hidden!important' as any as 'hidden',
  },
  '.os-theme-dark.os-host-rtl>.os-scrollbar-horizontal': {
    left: 10,
    right: 0,
  },
  '.os-scrollbar.os-scrollbar-unusable': {
    background: 0,
  },
  '.os-scrollbar>.os-scrollbar-track': {
    background: 0,
  },
  '.os-scrollbar-horizontal>.os-scrollbar-track>.os-scrollbar-handle': {
    minWidth: 30,
  },
  '.os-scrollbar-vertical>.os-scrollbar-track>.os-scrollbar-handle': {
    minHeight: 30,
  },
  '.os-theme-dark.os-host-transition>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle': {
    transition: 'background-color .3s',
  },
  '.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle, .os-scrollbar>.os-scrollbar-track': {
    borderRadius: 10,
  },
  '.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle': {
    background: theme.textMutedColor,
    opacity: 0.5,
  },
  '.os-scrollbar:hover>.os-scrollbar-track>.os-scrollbar-handle': {
    opacity: 0.6,
  },
  '.os-scrollbar-horizontal .os-scrollbar-handle:before, .os-scrollbar-vertical .os-scrollbar-handle:before':
    {
      content: "''",
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'block',
    },
  '.os-theme-dark.os-host-scrollbar-horizontal-hidden>.os-scrollbar-horizontal .os-scrollbar-handle:before, .os-theme-dark.os-host-scrollbar-vertical-hidden>.os-scrollbar-vertical .os-scrollbar-handle:before':
    {
      display: 'none',
    },
  '.os-scrollbar-horizontal .os-scrollbar-handle:before': {
    top: -6,
    bottom: -2,
  },
  '.os-scrollbar-vertical .os-scrollbar-handle:before': {
    left: -6,
    right: -2,
  },
  '.os-host-rtl.os-scrollbar-vertical .os-scrollbar-handle:before': {
    right: -6,
    left: -2,
  },
});

const GlobalScrollAreaStyles = () => <Global styles={getScrollAreaStyles} />;

export default GlobalScrollAreaStyles;
