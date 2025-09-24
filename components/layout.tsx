import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from './ui/sidebar';
import {
  Home,
  Users,
  UserCheck,
  Calendar,
  Settings,
  Briefcase
} from "lucide-react";

type Page = 'dashboard' | 'patients' | 'appointments' | 'services' | 'doctors';

const navigation = [
  { name: 'Dashboard', page: 'dashboard' as Page, icon: Home },
  { name: 'Patients', page: 'patients' as Page, icon: Users },
  { name: 'Doctors', page: 'doctors' as Page, icon: UserCheck },
  { name: 'Appointments', page: 'appointments' as Page, icon: Calendar },
  { name: 'Services', page: 'services' as Page, icon: Settings },
  { name: 'Doctor Workspace', page: 'doctors' as Page, icon: Briefcase },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">DC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Dental Care Pro</span>
                <span className="text-xs text-muted-foreground">Practice Management</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => {
                    const isActive = currentPage === item.page;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                          isActive={isActive}
                          onClick={() => onPageChange(item.page)}
                          className="w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-2">
              <div className="text-xs text-muted-foreground">
                © 2024 Dental Care Pro
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger />
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Welcome back, Dr. Smith
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
