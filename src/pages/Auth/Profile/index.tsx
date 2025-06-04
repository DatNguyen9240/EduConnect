import React, { useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2'; // Importing Line and Doughnut chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // For the Doughnut chart
} from 'chart.js'; // Importing necessary components from Chart.js
import 'animate.css'; // Importing animate.css for animations

// Registering the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProfileScreen: React.FC = () => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const [profileData, setProfileData] = useState({
    name: 'Hoàng Quốc Trí',
    email: 'trihqse170376@example.com',
    bio: 'Sinh viên năm cuối ngành Công nghệ Thông tin tại FPT University.',
    profilePic: 'https://i.pinimg.com/originals/3b/f4/26/3bf426c6589910174a635d0a401de5b1.jpg', // Default image
    grade: '1st Year',
    dob: '17/07/1999',
    gender: 'Male',
    address: 'Hà Nội, Vietnam',
    phone: '0123456789',
    father: {
      name: 'Nguyễn Quốc Duy',
      email: 'father@example.com',
      phone: '0123456789',
      occupation: 'Engineer',
    },
    mother: {
      name: 'Nguyễn Thị Lan',
      email: 'mother@example.com',
      phone: '0987654321',
      occupation: 'Teacher',
    },
  });

  // Chart Data for Line Chart
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Example data for months
    datasets: [
      {
        label: 'Study Hours',
        data: [30, 45, 60, 75, 90, 110], // Example data
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart Data for Doughnut Chart (Circle Chart)
  const doughnutChartData = {
    labels: ['Technology', 'Art', 'Music', 'Sports'], // Example categories
    datasets: [
      {
        data: [50, 25, 15, 10], // Example data representing percentages
        backgroundColor: ['#FF6347', '#4CAF50', '#FFD700', '#00BFFF'],
      },
    ],
  };

  // Handle input change in edit mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile picture change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevData) => ({
          ...prevData,
          profilePic: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-6 animate__animated animate__fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Picture and Bio */}
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <img
            src={profileData.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 transition-transform duration-500 hover:scale-110"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{profileData.name}</h2>
          <p className="text-sm text-gray-600">{profileData.email}</p>
          <p className="mt-4 text-center text-gray-700">{profileData.bio}</p>
        </div>

        {/* Personal Information */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <span className="font-bold text-gray-700">Grade:</span> {profileData.grade}
            </div>
            <div>
              <span className="font-bold text-gray-700">Date of Birth:</span> {profileData.dob}
            </div>
            <div>
              <span className="font-bold text-gray-700">Gender:</span> {profileData.gender}
            </div>
            <div>
              <span className="font-bold text-gray-700">Phone:</span> {profileData.phone}
            </div>
            <div>
              <span className="font-bold text-gray-700">Address:</span> {profileData.address}
            </div>
          </div>
        </div>
      </div>

      {/* Parents Information */}
      <div className="p-6 mt-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">Parents</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-gray-700">Father: {profileData.father.name}</h4>
            <div>Email: {profileData.father.email}</div>
            <div>Phone: {profileData.father.phone}</div>
            <div>Occupation: {profileData.father.occupation}</div>
          </div>

          <div>
            <h4 className="font-bold text-gray-700">Mother: {profileData.mother.name}</h4>
            <div>Email: {profileData.mother.email}</div>
            <div>Phone: {profileData.mother.phone}</div>
            <div>Occupation: {profileData.mother.occupation}</div>
          </div>
        </div>
      </div>

      {/* Line Chart for Study Hours */}
      <div className="p-6 mt-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">Study Hours Progress</h3>
        <Line data={lineChartData} options={{ responsive: true }} />
      </div>

      <div className="container mx-auto p-6 animate__animated animate__fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doughnut Chart for Interests */}
          <div className="p-6 bg-white rounded-lg shadow-lg border-4 border-gray-400">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Interests Distribution</h3>
            <div className="mx-auto">
              <Doughnut
                data={doughnutChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      labels: {
                        boxWidth: 20,
                        font: { size: 12 },
                      },
                    },
                  },
                }}
                style={{ height: '300px', width: '100%' }}
              />
            </div>
          </div>

          {/* Edit Profile Section */}
          <div className="p-6 bg-white rounded-lg shadow-lg border-4 border-gray-400">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Edit Profile</h3>
            <div className="space-y-3">
              <label className="block text-lg font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />

              <label className="block text-lg font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />

              <label className="block text-lg font-semibold mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!editMode}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              {editMode ? (
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Edit Profile
                </button>
              )}
              <label
                htmlFor="profilePic"
                className="cursor-pointer text-sm font-semibold text-blue-500 hover:text-blue-700 transition duration-300"
              >
                Change Profile Picture
              </label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
