import configureMockStore from "redux-mock-store";
import { mockState } from "./mockState";

const ConMockStore = configureMockStore();

const mockStore = ConMockStore(mockState);

export default mockStore;