import { SPINNING_LOADING_ID } from "../components/LinearLoading";

export const openLinearLoading = () => {
  const element = document.getElementById(SPINNING_LOADING_ID);
  if (element) {
    element.style.display = "flex";
  }
};

export const closeLinearLoading = () => {
  const element = document.getElementById(SPINNING_LOADING_ID);
  if (element) {
    element.style.display = "none";
  }
};

export const dragElement = (elm) => {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elm.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elm.style.top = elm.offsetTop - pos2 + "px";
    elm.style.left = elm.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
};
