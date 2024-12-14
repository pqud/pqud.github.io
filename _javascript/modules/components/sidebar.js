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
    } else {
      $body.removeAttr(ATTR_DISPLAY); //사이드바 닫기기
    }

    SidebarUtil.isExpanded = !SidebarUtil.isExpanded;
  }

  static close(){
    if(SidebarUtil.isExpanded){
      $body.removeAttr(ATTR_DISPLAY);
      SidebarUtil.isExpanded=false;
    }
  }
}

export function sidebarExpand() {
  $('#sidebar-trigger').on('click', SidebarUtil.toggle); //사이드바 열기닫기 트리거
  $('#mask').on('click', SidebarUtil.toggle); //마스크 클릭시 사이드바 닫기
  $("#sidebar-button .closebtn").on('click',SidebarUtil.close); //버튼 클릭시 사이드바 닫기
}
