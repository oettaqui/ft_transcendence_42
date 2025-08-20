import { LandingPageView } from "../views/LandingPageView";
import { LoginView } from "../views/LoginView";
import { RegisterView } from "../views/RegisterView";
import { EmailVerificationView } from "../views/EmailVerificationView";
import { RouteConfig } from "../types/RouteConfig";
import { HomeView } from "../views/HomeView";
import { GameView } from "../views/GameView";
import { ChatView } from "../views/ChatView";
import { SettingsView } from "../views/SettingsView";
import { TournamentView } from "../views/TournamentView";

export const routes: RouteConfig[] = [
  { path: '/', view: LandingPageView},
  { path: '/login', view: LoginView},
  { path: '/register', view: RegisterView},
  { path: '/email-verification', view: EmailVerificationView},
  { path: '/dashboard', view: HomeView},
  { path: '/dashboard/chat', view: ChatView},
  { path: '/dashboard/game', view: GameView},
  { path: '/dashboard/settings', view: SettingsView},
  { path: '/dashboard/tournament', view: TournamentView},
];