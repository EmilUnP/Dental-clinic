import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import Skeleton from "./skeleton"

const sidebarVariants = cva(
  "group relative flex w-full items-center justify-start gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-all [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: [
          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium",
          "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
        ],
        outline: [
          "text-sidebar-foreground shadow-[inset_0_0_0_1px_hsl(var(--sidebar-border))]",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[inset_0_0_0_1px_hsl(var(--sidebar-accent))]",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-[inset_0_0_0_1px_hsl(var(--sidebar-accent))] data-[active=true]:font-medium",
        ],
        ghost: [
          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground",
      className
    )}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-full w-full", className)}
    {...props}
  />
))
SidebarProvider.displayName = "SidebarProvider"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col gap-2 overflow-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "div" : "div"
  return (
    <Comp
      ref={ref}
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ReactNode
  } & VariantProps<typeof sidebarVariants>
>(({ className, asChild = false, isActive = false, variant = "default", ...props }, ref) => {
  const Comp = asChild ? "button" : "button"
  return (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(sidebarVariants({ variant }), className)}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex aspect-square w-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      className
    )}
    onClick={(event) => {
      onClick?.(event)
    }}
    {...props}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
    <span className="sr-only">Toggle Sidebar</span>
  </button>
))
SidebarTrigger.displayName = "SidebarTrigger"

export {
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
}
