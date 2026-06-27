import { useState } from 'react';
import { UploadCloud, Check, X, FileSpreadsheet, Users, Mail, AlertTriangle, UserPlus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { academicService } from '../../services/academicService';

type ImportResult = Awaited<ReturnType<typeof academicService.bulkImportStudents>>;

export default function AcademicStudentImport() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'CREATED' | 'SKIPPED' | 'FAILED'>('ALL');

  const onDrop = (accepted: File[]) => {
    if (accepted.length === 0) return;
    setFile(accepted[0]);
    setResult(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
  });

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file Excel');
      return;
    }
    try {
      setIsProcessing(true);
      toast.loading('Đang xử lý danh sách sinh viên...', { id: 'import-sv' });
      const data = await academicService.bulkImportStudents(file);
      setResult(data);
      toast.success(
        `Hoàn tất: ${data.createdCount} SV mới · ${data.skippedCount} bỏ qua · ${data.emailSentCount} mail đã gửi`,
        { id: 'import-sv' },
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message, { id: 'import-sv' });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setFilter('ALL');
  };

  const filteredRows = result?.results.filter(r => filter === 'ALL' || r.status === filter) ?? [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
          Nhập danh sách Sinh viên & Gửi tài khoản
          <UserPlus className="w-8 h-8 text-violet-500" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Upload file Excel danh sách SV — hệ thống tự tạo tài khoản (MSSV + mật khẩu ngẫu nhiên) và gửi email thông báo.
        </p>
      </div>

      <Card className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h2 className="text-base font-black text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-violet-500" />
          Yêu cầu format file
        </h2>
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium">
          <p>• Sheet đầu tiên (hoặc đặt tên <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Sinh Vien</code>)</p>
          <p>• Row 1: header — Cột A: <b>MSSV</b> · Cột B: <b>Họ tên</b> · Cột C: <b>Email</b></p>
          <p>• Row 2+: dữ liệu sinh viên (mỗi dòng = 1 SV)</p>
          <p className="text-amber-700 dark:text-amber-400">⚠ MSSV / email đã tồn tại sẽ bị <b>bỏ qua</b> (không reset password, không gửi mail).</p>
          <p className="text-emerald-700 dark:text-emerald-400">✓ SV mới: mật khẩu ngẫu nhiên 10 ký tự, bắt buộc đổi sau lần đăng nhập đầu tiên.</p>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Kéo thả file vào đây, hoặc click để chọn</p>
            <p className="text-xs text-slate-400 mt-1">Chỉ chấp nhận .xlsx (tối đa 5MB, ≤ 1000 SV / lần)</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{file.name}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-full text-emerald-700 dark:text-emerald-400"
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
                    <Users className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl">{result.totalRows}</p>
                    <p className="font-semibold">Tổng dòng</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                    <UserPlus className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl">{result.createdCount}</p>
                    <p className="font-semibold">SV mới</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl">{result.skippedCount}</p>
                    <p className="font-semibold">Bỏ qua</p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300">
                    <X className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl">{result.failedCount}</p>
                    <p className="font-semibold">Lỗi</p>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-800 dark:text-violet-300">
                    <Mail className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl">{result.emailSentCount}</p>
                    <p className="font-semibold">Mail đã gửi</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-slate-500">Lọc:</span>
                  {(['ALL', 'CREATED', 'SKIPPED', 'FAILED'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        filter === s
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {s === 'ALL' ? 'Tất cả' : s === 'CREATED' ? 'Mới' : s === 'SKIPPED' ? 'Bỏ qua' : 'Lỗi'}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold">
                      <tr>
                        <th className="text-left px-3 py-2">MSSV</th>
                        <th className="text-left px-3 py-2">Họ tên</th>
                        <th className="text-left px-3 py-2">Email</th>
                        <th className="text-left px-3 py-2">Trạng thái</th>
                        <th className="text-left px-3 py-2">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredRows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="px-3 py-2 font-mono font-bold text-slate-800 dark:text-slate-200">{r.mssv}</td>
                          <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{r.fullName}</td>
                          <td className="px-3 py-2 text-slate-500">{r.email}</td>
                          <td className="px-3 py-2">
                            {r.status === 'CREATED' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold">Mới</span>
                            )}
                            {r.status === 'SKIPPED' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold">Bỏ qua</span>
                            )}
                            {r.status === 'FAILED' && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold">Lỗi</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {'reason' in r ? r.reason : '—'}
                          </td>
                        </tr>
                      ))}
                      {filteredRows.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-slate-400 font-semibold">Không có dòng nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="rounded-xl" onClick={reset} disabled={isProcessing}>
                {result ? 'Nhập file khác' : 'Hủy'}
              </Button>
              {!result && (
                <Button
                  className="rounded-xl bg-violet-600 hover:bg-violet-700"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Xác nhận & Gửi mail'}
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
