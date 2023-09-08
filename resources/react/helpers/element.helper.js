import { PRIMARY_LOADING_ID } from "../components/PrimaryLoading";

export const openPrimaryLoading = () => {
    const element = document.getElementById(PRIMARY_LOADING_ID);
    if (element) {
        element.style.display = "flex";
    }
};

export const closePrimaryLoading = () => {
    const element = document.getElementById(PRIMARY_LOADING_ID);
    if (element) {
        element.style.display = "none";
    }
};
