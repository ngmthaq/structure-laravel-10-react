import { LINEAR_LOADING_ID } from "../components/LinearLoading";

export const openLinearLoading = () => {
    const element = document.getElementById(LINEAR_LOADING_ID);
    if (element) {
        element.style.display = "block";
    }
};

export const closeLinearLoading = () => {
    const element = document.getElementById(LINEAR_LOADING_ID);
    if (element) {
        element.style.display = "none";
    }
};
