export default function Profile() {
  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      <div className="bg-white shadow p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Personal Info</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-semibold">Mike Johnson</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Department</p>
            <p className="font-semibold">Engine & Transmission</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold">mike.johnson@example.com</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-semibold">+1 555 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
