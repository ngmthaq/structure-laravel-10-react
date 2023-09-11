import { commonReducer } from "./common.reducer";
import { authReducer } from "./auth.reducer";
import { userReducer } from "./user.reducer";

export const reducers = {
    auth: authReducer,
    common: commonReducer,
    user: userReducer,
};
