import React, { useState, useEffect, useContext } from 'react';
import { updateProfileById } from '../../../api/profile.api';
import type { UpdateProfileResponse } from '../../../api/profile.api';
import { useProfileContext } from '../../../contexts/profile.context';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { AppContext } from '../../../contexts/app.context';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';

interface ProfileUpdateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition';
const labelClass = 'block font-medium mb-1 text-gray-700';
const buttonClass = 'px-5 py-2 rounded-lg font-semibold transition focus:outline-none';

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({ onSuccess, onCancel }) => {
  const { profile } = useProfileContext();
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.accountId || '';
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    avatarFile: undefined as File | undefined,
    avatarPreview: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
        email: profile.email || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        avatarFile: undefined,
        avatarPreview: profile.avatarUrl || '',
      });
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const validate = () => {
    if (form.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      toast.error('Email không hợp lệ');
      return false;
    }
    if (form.phoneNumber && !/^(0[0-9]{9,10})$/.test(form.phoneNumber)) {
      toast.error('Số điện thoại không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!profile) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('FirstName', form.firstName);
      formData.append('LastName', form.lastName);
      formData.append('PhoneNumber', form.phoneNumber);
      formData.append('Email', form.email);
      formData.append(
        'DateOfBirth',
        form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split('T')[0] : ''
      );
      if (form.avatarFile) {
        formData.append('AvatarFile', form.avatarFile);
      }
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const res: UpdateProfileResponse = await updateProfileById(userId, formData);
      if (res.success) {
        toast.success('Cập nhật thành công!');
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error?.[0] || 'Cập nhật thất bại');
      }
    } catch (err) {
      const error = err as AxiosError<UpdateProfileResponse>;
      const errorMsg = error.response?.data?.error?.[0] || 'Cập nhật thất bại';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2">
          {form.avatarPreview ? (
            <img
              src={form.avatarPreview}
              alt="avatar preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-blue-200 shadow">
              ?
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer shadow hover:bg-blue-600 transition">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <span className="text-xs">Đổi</span>
          </label>
        </div>
        <span className="text-gray-500 text-sm">Ảnh đại diện</span>
      </div>
      <div>
        <label className={labelClass}>Họ</label>
        <input
          value={form.lastName}
          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          className={inputClass}
          placeholder="Nhập họ"
        />
      </div>
      <div>
        <label className={labelClass}>Tên</label>
        <input
          value={form.firstName}
          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          className={inputClass}
          placeholder="Nhập tên"
        />
      </div>
      <div>
        <label className={labelClass}>Số điện thoại</label>
        <input
          value={form.phoneNumber}
          onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
          className={inputClass}
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
          placeholder="Nhập email"
          disabled
        />
      </div>
      <div>
        <label className={labelClass}>Ngày sinh</label>
        <DatePicker
          selected={form.dateOfBirth ? parseISO(form.dateOfBirth) : null}
          onChange={(date: Date | null) => {
            setForm((f) => ({
              ...f,
              dateOfBirth: date ? format(date, 'yyyy-MM-dd') : '',
            }));
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chọn ngày sinh"
          className={inputClass}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={new Date()}
          isClearable
        />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
          onClick={onCancel}
          disabled={submitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className={`${buttonClass} bg-blue-500 text-white hover:bg-blue-600 shadow`}
          disabled={submitting}
        >
          {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;
