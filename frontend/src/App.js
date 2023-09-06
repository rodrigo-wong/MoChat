import "./App.css";
import { Route, Routes } from "react-router-dom";

import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import ConfirmRegistration from "./Pages/ConfirmRegistration";
import VerificationPage from "./Pages/VerificationPage";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/chats" Component={ChatPage} />
          <Route path="/confirm-registration/" Component={ConfirmRegistration} />
          <Route path="/verification/:status" Component={VerificationPage}/>
        </Routes>
    </div>
  );
}

export default App;
