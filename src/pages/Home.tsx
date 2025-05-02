import { PlaySquareOutlined, TagsOutlined, CommentOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Film Management System
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Kelola koleksi film, genre, dan komentar dengan mudah melalui platform kami yang intuitif.
              </p>
              <Link 
                to="/film" 
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Jelajahi Film
                <RightCircleOutlined className="ml-2" />
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlaySquareOutlined className="text-9xl text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Fitur Utama</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Film Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <PlaySquareOutlined className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Manajemen Film</h3>
              <p className="text-gray-600 text-center mb-6">
                Tambah, edit, dan kelola koleksi film dengan detail lengkap seperti judul, deskripsi, tahun rilis, dan rating.
              </p>
              <div className="text-center">
                <Link 
                  to="/film" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Kelola Film
                  <RightCircleOutlined className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Genre Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <TagsOutlined className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Kategori Genre</h3>
              <p className="text-gray-600 text-center mb-6">
                Organisasikan film berdasarkan genre untuk memudahkan pencarian dan pengelompokan konten berdasarkan kategori.
              </p>
              <div className="text-center">
                <Link 
                  to="/genre" 
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                >
                  Kelola Genre
                  <RightCircleOutlined className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Comment Feature */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CommentOutlined className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Pengelolaan Komentar</h3>
              <p className="text-gray-600 text-center mb-6">
                Pantau dan moderasi komentar pengguna untuk setiap film, sehingga mempertahankan diskusi yang berkualitas.
              </p>
              <div className="text-center">
                <Link 
                  to="/comment" 
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                >
                  Kelola Komentar
                  <RightCircleOutlined className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Platform Pengelolaan Film</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">Efisien</div>
              <p className="text-gray-600">Kelola ribuan film dengan antarmuka yang intuitif dan efisien</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">Terorganisir</div>
              <p className="text-gray-600">Pengkategorian dengan genre untuk mempermudah pengelolaan konten</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">Interaktif</div>
              <p className="text-gray-600">Kelola interaksi pengguna melalui sistem komentar yang terintegrasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Mulai Kelola Koleksi Film Anda</h2>
          <p className="text-xl mb-8 text-gray-300">
            Gunakan sistem manajemen film kami untuk mengorganisir dan mengelola konten film dengan mudah dan efisien.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/film" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Manajemen Film
            </Link>
            <Link 
              to="/genre" 
              className="bg-transparent border border-white hover:bg-white hover:text-gray-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Kelola Genre
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home