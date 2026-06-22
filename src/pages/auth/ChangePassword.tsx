import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: '/admin',
  SINH_VIEN: '/student/dashboard',
  GIANG_VIEN: '/teacher/dashboard',
  PHONG_DAO_TAO: '/academic/dashboard',
};

export default function ChangePassword() {
  const { user, logout, login, token } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isForced = user?.mustChangePassword === true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ các trường mật khẩu.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải chứa ít nhất 8 ký tự.');
      return;
    }
    if (newPassword === currentPassword) {
      toast.error('Mật khẩu mới phải khác mật khẩu hiện tại.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.changePassword(currentPassword, newPassword);

      // Clear mustChangePassword cờ local ngay; AuthProvider effect cũng sẽ refetch /users/profile.
      if (user && token) {
        login(token, { ...user, mustChangePassword: false });
      }

      toast.success('Đổi mật khẩu thành công.');
      const target = user ? (ROLE_ROUTES[user.role] || '/') : '/';
      navigate(target, { replace: true });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Đổi mật khẩu</CardTitle>
          <CardDescription className="text-center">
            {isForced
              ? 'Tài khoản đang dùng mật khẩu mặc định. Vui lòng đổi mật khẩu trước khi tiếp tục.'
              : 'Cập nhật mật khẩu mới cho tài khoản của bạn.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md hover:bg-primary/90 flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Xác nhận đổi mật khẩu'
              )}
            </button>
            {isForced && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
                className="text-sm text-muted-foreground hover:underline"
              >
                Đăng xuất
              </button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
