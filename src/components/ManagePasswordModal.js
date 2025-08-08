"use client";

const ManagePasswordModal = ({
  onClose,
  onRemovePassword,
  onOptOut,
  isOwner,
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4">Manage Password</h2>

        {isOwner ? (
          <>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded w-full mb-2"
              onClick={onRemovePassword}
            >
              Remove Password
            </button>
          </>
        ) : (
          <p className="text-gray-600 mb-4">
            You {"can't"} remove thy password.
          </p>
        )}

        <button
          className="bg-gray-400 text-white px-4 py-2 rounded w-full mb-2"
          onClick={onOptOut}
        >
          Opt Out
        </button>

        <button
          className="bg-gray-200 text-black px-4 py-2 rounded w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ManagePasswordModal;
