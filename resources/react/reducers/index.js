import { commonReducer } from "./common.reducer";
import { authReducer } from "./auth.reducer";

export const reducers = {
    auth: authReducer,
    common: commonReducer,
};
