import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import PostDetailPage from "./pages/PostDetailPage";
import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import CreatePostPage from "./pages/CreatePostPage";
import PrivateRoute from "./context/PrivateRoute";
import UserProfile from "./components/UserProfile";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex-grow: 1;
`;

const App = () => (
  <AuthProvider>
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/posts" element={<PostPage/>} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/profile" element={<UserProfile />} />
            <Route
              path="/create-post"
              element={
                <PrivateRoute>
                  <CreatePostPage />
                </PrivateRoute>
              }
            />  
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  </AuthProvider>
)

export default App;