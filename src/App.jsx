import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Poetry from './pages/Poetry';
import PoetryCategory from './pages/PoetryCategory';
import PoemDetail from './pages/PoemDetail';
import Music from './pages/Music';
import Album from './pages/Album';
import Track from './pages/Track';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Media from './pages/Media';
import MediaDetail from './pages/MediaDetail';
import Biography from './pages/Biography';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import { AudioPlayerProvider } from './lib/audioPlayerContext';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <AudioPlayerProvider>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/poetry" element={<Poetry />} />
          <Route path="/poetry/:categorySlug" element={<PoetryCategory />} />
          <Route path="/poetry/:categorySlug/:poemSlug" element={<PoemDetail />} />
          <Route path="/music" element={<Music />} />
          <Route path="/music/album/:albumSlug" element={<Album />} />
          <Route path="/music/album/:albumSlug/:trackSlug" element={<Track />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/media" element={<Media />} />
          <Route path="/media/:slug" element={<MediaDetail />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AudioPlayerProvider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App