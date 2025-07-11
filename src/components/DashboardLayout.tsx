
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Link2, Film, Mail, Menu } from 'lucide-react';

const navLinks = [
  { href: '/dashboard/create', label: 'Create Link', icon: Link2 },
  { href: '/dashboard/reels', label: 'My Reels ID', icon: Film },
  { href: '/dashboard/connect-me', label: 'Connect Me', icon: Mail },
];

function SidebarContent() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <div className="flex flex-col items-center text-center p-6 border-b border-border">
        <Avatar className="w-24 h-24 mb-4 border-4 border-primary shadow-lg">
          <AvatarImage src="/user.jpg" alt={user?.name} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{user?.name?.charAt(0) || 'A'}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-primary-foreground">{user?.name || 'Admin User'}</h2>
      </div>
      <nav className="flex-grow p-4 space-y-2" >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
              location.pathname.startsWith(link.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}>
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="text-center text-xs text-muted-foreground p-4 border-t border-border">
        created by vinaytz
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout.');
    }
  };

  const getBreadcrumb = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length < 2) return 'Dashboard';
    const pageName = path[1].charAt(0).toUpperCase() + path[1].slice(1);
    return `Dashboard > ${pageName}`;
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0 border-r border-border">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-card border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-foreground">{getBreadcrumb()}</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
