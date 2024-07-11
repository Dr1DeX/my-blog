import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import PostPage from "./pages/PostPage/PostPage";
import PostDetailPage from "./pages/PostDetailPage/PostDetailPage";
import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import CreatePostPage from "./pages/CreatePost/CreatePostPage";
import PrivateRoute from "./context/PrivateRoute";
import Header from "./components/Header/Header";
import UserProfile from "./components/UserProfile/UserProfile";
import AppContainer from "./components/App/AppContainer";
import MainContent from "./components/App/MainContent";


const App = () => (
  <AuthProvider>
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/posts" element={<PostPage postUrl="http://localhost:8001/api/post/all" />} />
            <Route path="/my-posts" element={<PostPage postUrl="http://localhost:8001/api/post/my_posts" />} />
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