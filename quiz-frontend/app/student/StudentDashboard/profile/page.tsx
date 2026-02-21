"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PasswordModal from "./_components/PasswordModal";
import {
  getProfile,
  updateProfilePicture,
  verifyPassword,
  changePassword,
} from "@/lib/api/student-api";
import { useAuth } from "@/context/AuthContext";

interface Student {
  fullName: string;
  email: string;
  className: string;
  imageUrl?: string;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      toast.loading("Uploading...", { id: "upload" });
      await updateProfilePicture(formData);
      toast.success("Profile updated", { id: "upload" });
      fetchProfile();
    } catch {
      toast.error("Upload failed", { id: "upload" });
    }
  };

  const handleVerifyPassword = async () => {
    try {
      const isValid = await verifyPassword(currentPassword);

      if (isValid) {
        setShowVerifyModal(false);
        setShowChangeModal(true);
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Verification failed");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Fill all fields");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await changePassword(newPassword);
      toast.success("Password changed successfully");

      setShowChangeModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch {
      toast.error("Password update failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">
          Failed to load profile
        </p>
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">


        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl p-8 transition hover:shadow-2xl">

          <div
            className="relative w-28 h-28 mx-auto cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {profile.imageUrl ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${profile.imageUrl}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-indigo-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600 transition-transform group-hover:scale-105">
                {profile.fullName?.charAt(0)}
              </div>
            )}

            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <span className="text-white text-xs font-medium">
                Change Photo
              </span>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          <div className="text-center mt-6 space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.fullName}
            </h2>

            <p className="text-gray-500 text-sm">
              {profile.email}
            </p>

            <p className="text-gray-500 text-sm">
              Class: {profile.className}
            </p>
          </div>
        </div>


        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl p-6 space-y-4">

          <h3 className="text-sm uppercase tracking-wide text-gray-500">
            Account
          </h3>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="w-full flex justify-between items-center px-5 py-3 rounded-2xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition"
          >
            <span className="font-medium text-gray-700">
              Change Password
            </span>
          </button>

          <button
            onClick={logout}
            className="w-full flex justify-between items-center px-5 py-3 rounded-2xl border border-gray-200 hover:border-red-400 hover:bg-red-50 transition"
          >
            <span className="font-medium text-red-600">
              Logout
            </span>
          </button>
        </div>
      </div>

{/* 
      {showVerifyModal && (
        <Modal
          title="Verify Password"
          onClose={() => setShowVerifyModal(false)}
        >
          <input
            type="password"
            className="w-full border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
          />

          <button
            onClick={handleVerifyPassword}
            disabled={!currentPassword}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl disabled:opacity-40 transition"
          >
            Verify
          </button>
        </Modal>
      )} */}


      {/* {showChangeModal && (
        <Modal
          title="Set New Password"
          onClose={() => setShowChangeModal(false)}
        >
          <input
            type="password"
            className="w-full border rounded-2xl px-4 py-3 text-sm mb-3"
            placeholder="New password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <input
            type="password"
            className="w-full border rounded-2xl px-4 py-3 text-sm"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button
            onClick={handleChangePassword}
            disabled={!newPassword || !confirmPassword}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl disabled:opacity-40 transition"
          >
            Change Password
          </button>
        </Modal>
      )} */}
      <PasswordModal
        showVerifyModal={showVerifyModal}
        showChangeModal={showChangeModal}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        onVerify={handleVerifyPassword}
        onChange={handleChangePassword}
        onCloseVerify={() => setShowVerifyModal(false)}
        onCloseChange={() => setShowChangeModal(false)}
      />
    </div>
  );
}

// function Modal({
//   title,
//   children,
//   onClose,
// }: {
//   title: string;
//   children: React.ReactNode;
//   onClose: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50 px-4 animate-fadeIn">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
//         <div className="flex justify-between mb-4">
//           <h3 className="font-semibold text-gray-800">
//             {title}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             ✕
//           </button>
//         </div>

//         {children}
//       </div>
//     </div>
//   );
// }