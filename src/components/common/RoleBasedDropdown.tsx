import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { RoleGuard } from "./RoleGuard"
import type { User } from "@/types/user"
import React, { type ReactNode } from "react"

// For the Dropdown itself, we might want to hide the TRIGGER if the user has no access to ANY items?
// OR, more likely, we just want to hide specific ITEMS.
// This component wraps the whole dropdown, hiding it entirely if role doesn't match.

interface RoleBasedDropdownProps {
  children: ReactNode
  allowedRoles: User['role'][]
  [key: string]: any // Pass through other props to DropdownMenu
}

export function RoleBasedDropdown({ children, allowedRoles, ...props }: RoleBasedDropdownProps) {
  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <DropdownMenu {...props}>
          {children}
      </DropdownMenu>
    </RoleGuard>
  )
}

// Also export a wrapper for DropdownMenuItem for granular control
interface RoleBasedDropdownItemProps extends React.ComponentProps<typeof DropdownMenuItem> {
    allowedRoles: User['role'][]
}

export function RoleBasedDropdownItem({ allowedRoles, children, ...props }: RoleBasedDropdownItemProps) {
    return (
        <RoleGuard allowedRoles={allowedRoles}>
            <DropdownMenuItem {...props}>
                {children}
            </DropdownMenuItem>
        </RoleGuard>
    )
}
