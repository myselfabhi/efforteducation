'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore, type UserRole } from '@/lib/stores/authStore';
import { useUiStore } from '@/lib/stores/uiStore';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  ClipboardList,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function navFor(role: UserRole): NavItem[] {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return [
        { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/admin/users', label: 'Users', icon: Users },
        { href: '/dashboard/admin/courses', label: 'Courses', icon: BookOpen },
        { href: '/dashboard/admin/batches', label: 'Batches', icon: GraduationCap },
        { href: '/dashboard/admin/classes', label: 'Live Classes', icon: Video },
        { href: '/dashboard/admin/quizzes', label: 'Quizzes', icon: ClipboardList },
      ];
    case 'teacher':
      return [
        { href: '/dashboard/teacher', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/teacher/batches', label: 'My Batches', icon: GraduationCap },
        { href: '/dashboard/teacher/classes', label: 'Live Classes', icon: Video },
        { href: '/dashboard/teacher/materials', label: 'Materials', icon: FileText },
        { href: '/dashboard/teacher/quizzes', label: 'Quizzes', icon: ClipboardList },
        { href: '/dashboard/teacher/announcements', label: 'Announcements', icon: Megaphone },
      ];
    case 'student':
    case 'user':
    default:
      return [
        { href: '/dashboard/student', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/student/batches', label: 'My Batches', icon: GraduationCap },
        { href: '/dashboard/student/classes', label: 'Live Classes', icon: Video },
        { href: '/dashboard/student/materials', label: 'Materials', icon: FileText },
        { href: '/dashboard/student/quizzes', label: 'Quizzes', icon: ClipboardList },
      ];
  }
}

function SidebarContent({
  collapsed,
  onNavClick,
  showCloseButton,
  onClose,
}: {
  collapsed: boolean;
  onNavClick?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggle = useUiStore((s) => s.toggleSidebar);

  if (!user) return null;
  const items = navFor(user.role);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/" className={cn('font-black text-lg text-primary', collapsed && 'sr-only')}>
          Effort Edu
        </Link>
        {showCloseButton ? (
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={toggle}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground/70 hover:bg-sidebar-accent hover:text-foreground'
              )}
              title={collapsed ? it.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{it.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border space-y-1">
        <Link
          href="/dashboard/profile"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-sidebar-accent hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Profile</span>}
        </Link>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileSidebarOpen);
  const closeMobile = useUiStore((s) => s.closeMobileSidebar);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex sticky top-0 h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-200',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-sidebar text-sidebar-foreground border-r border-border md:hidden">
            <SidebarContent
              collapsed={false}
              showCloseButton
              onClose={closeMobile}
              onNavClick={closeMobile}
            />
          </aside>
        </>
      )}
    </>
  );
}
