import { ArticlePermission } from '@/api/dto/auth.dto';

export class PermissionHandler {
  public static isPermissionMatch({
    requiredPermissions,
    permissions,
  }: {
    requiredPermissions: ArticlePermission[];
    permissions: ArticlePermission[];
  }) {
    const permissionMap = permissions.reduce<{ [permission: string]: boolean }>(
      (acc, permission) => {
        acc[permission] = true;

        return acc;
      },
      {}
    );

    return requiredPermissions.some((permission) => permissionMap[permission]);
  }
}
