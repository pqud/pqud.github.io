/**
 * Expand or close the sidebar in mobile screens.
 */


const $body = $('body');
const ATTR_DISPLAY = 'sidebar-display';

class SidebarUtil {
  static isExpanded = false;

  static toggle() {
    if (SidebarUtil.isExpanded === false) {
      $body.attr(ATTR_DISPLAY, ''); //사이드바 열기
      console.log("Sidebar open."); // 디버깅 로그
    } else {
      $body.removeAttr(ATTR_DISPLAY); //사이드바 닫기
      console.log("Sidebar closed."); // 디버깅 로그
    }

    SidebarUtil.isExpanded = !SidebarUtil.isExpanded;
  }
}

export function sidebarExpand() {
  $('#sidebar-trigger').on('click', SidebarUtil.toggle); //사이드바 열기닫기 트리거
  $('#mask').on('click', SidebarUtil.toggle); //마스크 클릭시 사이드바 닫기
}
