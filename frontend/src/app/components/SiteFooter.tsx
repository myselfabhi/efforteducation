export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-2xl font-bold mb-2">
            <span className="text-red-600">effort</span>
            <span className="ml-1">education</span>
          </div>
          <p className="text-gray-400 text-sm">© Effort Education 2025</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li><a href="#about" className="hover:text-red-500">About</a></li>
            <li><a href="#programs" className="hover:text-red-500">Programs</a></li>
            <li><a href="#contact" className="hover:text-red-500">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Follow</h4>
          <div className="flex space-x-3 text-gray-300">
            <a href="#" className="hover:text-red-500">YouTube</a>
            <a href="#" className="hover:text-red-500">Facebook</a>
            <a href="#" className="hover:text-red-500">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


