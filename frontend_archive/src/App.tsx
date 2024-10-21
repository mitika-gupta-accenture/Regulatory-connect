import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./core/store/store";
import { Provider } from "react-redux";
import PageRoutesAndNavigation from "./components/routes/Routes";
import "./asset/scss/styles.scss";

const App = React.memo(() => {

  return (
    <Provider store={store}>
      <Router>
        <PageRoutesAndNavigation />
      </Router>
    </Provider>
  );
});

export default App;
