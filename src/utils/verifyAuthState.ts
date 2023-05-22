// This function will ping api and update userGlobal state in redux
// This will be attached to onEnter prop(check react router docs) for client routes
import axios from "axios";
import { store } from "../client/redux/store";
import { setSessionUser } from "../client/redux/reducers/authReducer";
const threeMinute = 180000;

const verifyAuthState = async () => {
  await axios
    .get("/api/auth/credentials")
    .then(res => {
      console.log(`logged in as ${res.data?.email}`);
      store.dispatch(setSessionUser(res.data));
    })
    .catch(err => store.dispatch(setSessionUser(null)));
};

export default verifyAuthState;
