import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';

// 페이지 imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BranchListPage from './pages/member/BranchListPage';
import BranchDetailPage from './pages/member/BranchDetailPage';
import MyPassesPage from './pages/member/MyPassesPage';
import MyReservationPage from './pages/member/MyReservationPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SignUpPage from './pages/SignUpPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';

function App() {
  return (
    // AuthProvider: 로그인 상태를 앱 전체에서 공유
    <AuthProvider>
      {/* BrowserRouter: URL 기반 페이지 라우팅 */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Header />
        <Routes>
          {/* 공개 페이지 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
          <Route path="/branches" element={<BranchListPage />} />
          <Route path="/branches/:branchId" element={<BranchDetailPage />} />

          {/* 회원 전용 페이지 */}
          <Route path="/my/passes" element={<MyPassesPage />} />
          <Route path="/my/reservations" element={<MyReservationPage />} />

          {/* 관리자 페이지 */}
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* 404 처리 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <h2>404 - 페이지를 찾을 수 없습니다</h2>
              <a href="/" style={{ color: '#2563eb' }}>홈으로 돌아가기</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
