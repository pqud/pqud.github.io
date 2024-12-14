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

  static close(){ //강제닫기
    if(SidebarUtil.isExpanded){
      $body.removeAttr(ATTR_DISPLAY);
      SidebarUtil.isExpanded=false;
      console.log($("#sidebar-button .closebtn")); // 확인용
    }
  }
}

export function sidebarExpand() {
  $('#sidebar-trigger').on('click', SidebarUtil.toggle); //사이드바 열기닫기 트리거
  $('#mask').on('click', SidebarUtil.toggle); //마스크 클릭시 사이드바 닫기
  $('#sidebar-button button').on('click', SidebarUtil.close); // 닫기 버튼 클릭 시 닫기
}
