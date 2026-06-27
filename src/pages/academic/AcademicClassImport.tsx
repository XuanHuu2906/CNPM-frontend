import { useState } from 'react';
import { UploadCloud, Check, X, FileSpreadsheet, GraduationCap, User, BookOpen, Calendar, Users } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { academicService } from '../../services/academicService';

type ImportResult = Awaited<ReturnType<typeof academicService.importClassFromExcel>>;

export default function AcademicClassImport() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      toast.loading('Đang tạo lớp từ file Excel...', { id: 'import-class' });
      const data = await academicService.importClassFromExcel(file);
      setResult(data);
      toast.success(
        `Đã tạo lớp ${data.class.classCode} · ${data.studentCount} SV` +
          (data.createdUsersCount > 0 ? ` · ${data.createdUsersCount} SV mới` : ''),
        { id: 'import-class' },
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message, { id: 'import-class' });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
          Nhập Lớp Học Phần Từ Excel
          <FileSpreadsheet className="w-8 h-8 text-violet-500" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Mỗi file = 1 lớp học phần. Hệ thống tự tạo Lớp + gán Giảng viên phụ trách + đăng ký toàn bộ sinh viên (tài khoản tự sinh nếu chưa có).
        </p>
      </div>

      <Card className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h2 className="text-base font-black text-slate-800 dark:text-slate-100 mb-3">Yêu cầu format file</h2>
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium">
          <p>• Sheet: <code className="px-1.5 py-0.5 bg-slate-100 rounded">Điểm Danh</code></p>
          <p>• Ô <code className="px-1.5 py-0.5 bg-slate-100 rounded">D2</code>: Tên học kỳ (vd <i>"HỌC KỲ 2 - NĂM HỌC 2025 - 2026"</i>)</p>
          <p>• Ô <code className="px-1.5 py-0.5 bg-slate-100 rounded">C4</code>: Tên môn · Ô <code className="px-1.5 py-0.5 bg-slate-100 rounded">E4</code>: Mã môn</p>
          <p>• Ô <code className="px-1.5 py-0.5 bg-slate-100 rounded">B6</code>: Mã lớp · Ô <code className="px-1.5 py-0.5 bg-slate-100 rounded">D6</code>: Mã giảng viên phụ trách</p>
          <p>• Row 7: header bảng (STT / MSSV / Họ lót / Tên / ...)</p>
          <p>• Row 8+: danh sách sinh viên (MSSV cột B, Họ lót cột C, Tên cột D)</p>
          <p className="text-amber-700 dark:text-amber-400">⚠ Sinh viên chưa có tài khoản sẽ được tự tạo (mật khẩu mặc định <code className="px-1 bg-amber-100 rounded">123456</code>, bắt buộc đổi sau lần đầu đăng nhập). Học kỳ / môn học chưa có cũng được tự tạo.</p>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-violet-500 bg-violet-50' : 'border-slate-300 hover:bg-slate-50'}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-sm font-bold text-slate-600">Kéo thả file vào đây, hoặc click để chọn</p>
            <p className="text-xs text-slate-400 mt-1">Chỉ chấp nhận .xlsx (tối đa 5MB)</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">{file.name}</p>
                  <p className="text-xs text-emerald-600">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="p-1 hover:bg-emerald-100 rounded-full text-emerald-700"
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-violet-50 text-violet-800">
                    <Users className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl">{result.studentCount}</p>
                    <p className="font-semibold">Sinh viên đăng ký</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800">
                    <User className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl">{result.createdUsersCount}</p>
                    <p className="font-semibold">Tài khoản SV mới</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-800">
                    <GraduationCap className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl truncate">{result.teacher.teacherCode}</p>
                    <p className="font-semibold truncate" title={result.teacher.fullName}>{result.teacher.fullName}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-800">
                    <BookOpen className="w-4 h-4 mx-auto mb-1" />
                    <p className="font-bold text-xl truncate">{result.class.classCode}</p>
                    <p className="font-semibold truncate" title={result.class.subject.name}>{result.class.subject.code}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 text-sm space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 font-semibold">Học kỳ:</span>
                    <span className="text-slate-800 font-bold">{result.class.term.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 font-semibold">Môn học:</span>
                    <span className="text-slate-800 font-bold">{result.class.subject.code}</span>
                    <span className="text-slate-600">— {result.class.subject.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 font-semibold">GV phụ trách:</span>
                    <span className="text-slate-800 font-bold">{result.teacher.teacherCode}</span>
                    <span className="text-slate-600">— {result.teacher.fullName}</span>
                    <span className="text-slate-400 text-xs">({result.teacher.email})</span>
                  </div>
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
                  {isProcessing ? 'Đang xử lý...' : 'Xác nhận tạo lớp'}
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
