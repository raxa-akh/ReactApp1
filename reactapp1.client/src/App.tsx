import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Layout from './layout/Layout';
import ListEditorPage from './pages/ListEditorPage';
import MyListsPage from './pages/MyListsPage';
import SharedListsPage from './pages/SharedListsPage';
import RegisterPage from "./pages/RegisterPage"
import "./App.css"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    }
                />
                <Route
                    path="/my-lists"
                    element={
                        <Layout>
                            <MyListsPage />
                        </Layout>
                    }
                />

                <Route
                    path="/list/:id"
                    element={
                        <Layout>
                            <ListEditorPage />
                        </Layout>
                    }
                />
                
                <Route path="/shared"
                    element={
                        <Layout>
                            <SharedListsPage />
                        </Layout>
                } />


            </Routes>
        </BrowserRouter>
    );
}

export default App;
