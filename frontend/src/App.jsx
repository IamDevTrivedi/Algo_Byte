import { BrowserRouter,Routes,Route, Link, Navigate } from "react-router";
import Home from "./pages/homePage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./authSlice";
import {CreateProblem } from "./pages/CreateProblem";
import { UpdateProblem } from "./pages/UpdateProblems";
import { DeleteProblem } from "./pages/DeleteProblem";
import { SubUpdateProblem } from "./pages/SubUpdateProblem";
import {ProblemPage} from "./pages/ProblemPage";
import { AdminPanel } from "./pages/AdminPanel";
import { LandingPage } from "./pages/LandingPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import  UploadVideo  from './pages/UploadVideo';
import VideoToStorage from "./pages/VideoToStorage";
import UserDashboard from "./pages/UserDashboard";
import { useThemeStore } from "./stores/themeStore";
import { ResetPassword } from "./pages/ResetPassword";
import { ForgotPassword } from "./pages/ForgotPassword";
import { useLocation } from "react-router";
import { NotFound } from "./pages/NotFound";
import { DiscussionForum } from "./pages/DiscussionPage";
import { MyPosts } from "./pages/MyPosts";

import CreateContest from "./pages/CreateContest";
import ContestPage from "./pages/ContestPage";
import ContestStart from "./pages/ContestStart";
import { ContestProblemPage } from "./pages/ContestProblemPage";
import ContestViewSubmissions from "./pages/ContestViewSubmission";
import MyContests from "./pages/MyContests";

import CreatePOTD from "./pages/createPotd";
import { FeaturesPage } from "./pages/Features";
import BattleRoom from "./pages/BattleRoom";
import BattlePage from "./pages/BattlePage";
import { BattleProblemPage } from "./pages/BattleProblemPage";
import { BattleLeaderboard } from "./pages/BattleBoard";

function App(){

  const {isAuthenticated,loading,user}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const theme=useThemeStore((state) => state.theme);
  const location=useLocation();

  
  //check initial Authentication
  useEffect(() => {
    const isForgotPasswordRoute = /^\/forgotpassword\/[^/]+\/[^/]+$/.test(location.pathname);
    
  
    if (!isForgotPasswordRoute ) {
      dispatch(checkAuth());
    }
  }, [location.pathname, dispatch]);
  

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }


  if(isAuthenticated==undefined){
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  

  return (
    <div>
    
        
      
      <Routes>
        <Route path="/features" element={<FeaturesPage></FeaturesPage>}></Route>
        <Route path="/homepage" element={isAuthenticated?<Home></Home>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/" element={!isAuthenticated?<LandingPage></LandingPage>:<Navigate to='/homepage'></Navigate>}></Route>
        <Route path="/login" element={isAuthenticated?<Navigate to='/homepage'></Navigate>:<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to='/homepage'></Navigate>:<SignUp></SignUp>}></Route>
        <Route path="/admin/createProblem" element={isAuthenticated && user?.role === 'admin'?<CreateProblem></CreateProblem>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/admin/updateProblem" element={isAuthenticated && user?.role === 'admin'?<UpdateProblem></UpdateProblem>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/admin/deleteProblem" element={isAuthenticated && user?.role === 'admin'?<DeleteProblem></DeleteProblem>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/problem/update/:id" element={isAuthenticated && user?.role === 'admin'?<SubUpdateProblem></SubUpdateProblem>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/problem/:id" element={<ProblemPage></ProblemPage>}></Route>
        <Route path="/problem/:id/room/:roomId" element={<ProblemPage />} />
        <Route path="/adminPanel" element={isAuthenticated && user?.role === 'admin'?<AdminPanel></AdminPanel>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin'?<UploadVideo></UploadVideo>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/admin/videos/upload/:problemId" element={isAuthenticated && user?.role === 'admin'?<VideoToStorage></VideoToStorage>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/userDashboard" element={isAuthenticated?<UserDashboard></UserDashboard>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/contest" element={isAuthenticated ?<ContestPage></ContestPage>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/myContests" element={isAuthenticated||isAuthenticated===undefined||loading?<MyContests></MyContests>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/contest/:contestId/start" element={isAuthenticated ?<ContestStart></ContestStart>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/contest/:contestId/problem/:problemId" element={isAuthenticated ?<ContestProblemPage></ContestProblemPage>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/contest/view/:contestId" element={isAuthenticated ?<ContestViewSubmissions></ContestViewSubmissions>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/resetPassword" element={<ResetPassword/>}></Route>
        <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound></NotFound>}></Route>
        <Route path="/discussionForum" element={isAuthenticated ?<DiscussionForum></DiscussionForum>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/myposts" element={isAuthenticated ?<MyPosts></MyPosts>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/admin/createContest" element={isAuthenticated && user?.role === 'admin'?<CreateContest></CreateContest>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/admin/createPotd" element={isAuthenticated && user?.role === 'admin'?<CreatePOTD></CreatePOTD>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/battleRoom" element={isAuthenticated ?<BattleRoom></BattleRoom>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/battle/:roomId" element={isAuthenticated ?<BattlePage></BattlePage>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/battle/problem/:roomId" element={isAuthenticated ?<BattleProblemPage></BattleProblemPage>:<Navigate to='/'></Navigate>}></Route>
        <Route path="/battle/LeaderBoard/:roomId" element={isAuthenticated ?<BattleLeaderboard></BattleLeaderboard>:<Navigate to='/'></Navigate>}></Route>
        
      </Routes>
    </div>
  )
}

export default App