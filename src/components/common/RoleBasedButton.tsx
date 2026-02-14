import { Button, type ButtonProps } from "@/components/ui/button"
import { RoleGuard } from "./RoleGuard"
import type { User } from "@/types/user"

interface RoleBasedButtonProps extends ButtonProps {
  allowedRoles: User['role'][]
}

export function RoleBasedButton({ allowedRoles, ...props }: RoleBasedButtonProps) {
  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <Button {...props} />
    </RoleGuard>
  )
}
