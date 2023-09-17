import { ArticlePermission } from '@/api/dto/auth.dto';
import { useMemo } from 'react';
import { PermissionHandler } from './permission.handler';

type PermissionControlProps = {
  children: React.ReactNode;
  permissions: ArticlePermission[];
  requiredPermissions: ArticlePermission[];
};

export function PermissionControl(props: PermissionControlProps) {
  const isPermissionMatch = useMemo(() => {
    const { requiredPermissions, permissions } = props;

    return PermissionHandler.isPermissionMatch({ requiredPermissions, permissions });
  }, [props.permissions, props.requiredPermissions]);

  return isPermissionMatch ? props.children : null;
}
