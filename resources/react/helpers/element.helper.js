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
