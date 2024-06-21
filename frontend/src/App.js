import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import GlobalStyles from "./GlobalStyles";

const App = () => (
  <Router>
    <GlobalStyles />
    <Header/>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/posts" element={<PostPage/>} />
    </Routes>
    <Footer/>
  </Router>
)

export default App;