import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import PostDetailPage from "./pages/PostDetailPage";
import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex-grow: 1;
`;

const App = () => (
  <Router>
    <GlobalStyles />
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/posts" element={<PostPage/>} />
          <Route path="/post/:id" element={<PostDetailPage />} />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  </Router>
)

export default App;