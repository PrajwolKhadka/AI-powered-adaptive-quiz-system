"use client";

interface Props {
  showVerifyModal: boolean;
  showChangeModal: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  setCurrentPassword: (val: string) => void;
  setNewPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;

  onVerify: () => void;
  onChange: () => void;
  onCloseVerify: () => void;
  onCloseChange: () => void;
}

export default function PasswordModal({
  showVerifyModal,
  showChangeModal,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  onVerify,
  onChange,
  onCloseVerify,
  onCloseChange,
}: Props) {

  if (!showVerifyModal && !showChangeModal) return null;

  return (
    <>
      {showVerifyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Verify Password</h3>
              <button onClick={onCloseVerify}>✕</button>
            </div>

            <input
              type="password"
              placeholder="Current password"
              className="w-full border rounded-xl px-4 py-3"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <button
              onClick={onVerify}
              disabled={!currentPassword}
              className="w-full mt-4 bg-green-600 text-white py-2.5 rounded-xl disabled:opacity-40"
            >
              Verify
            </button>
          </div>
        </div>
      )}

      {showChangeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Set New Password</h3>
              <button onClick={onCloseChange}>✕</button>
            </div>

            <input
              type="password"
              placeholder="New password"
              className="w-full border rounded-xl px-4 py-3 mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border rounded-xl px-4 py-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={onChange}
              disabled={!newPassword || !confirmPassword}
              className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-xl disabled:opacity-40"
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </>
  );
}