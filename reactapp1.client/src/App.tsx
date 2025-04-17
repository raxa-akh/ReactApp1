import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
//import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                    <PrivateRoute>
                        {/*<HomePage />*/}
                        <p>{'\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D...'}</p>

                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
