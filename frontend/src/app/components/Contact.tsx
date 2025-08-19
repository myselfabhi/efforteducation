export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <form className="grid grid-cols-1 gap-4">
            <input className="border rounded-md p-3" placeholder="Name" aria-label="Name" />
            <input className="border rounded-md p-3" placeholder="Email" aria-label="Email" />
            <input className="border rounded-md p-3" placeholder="Phone" aria-label="Phone" />
            <input
              className="border rounded-md p-3"
              placeholder="Interested Course/Program"
              aria-label="Interested Course"
            />
            <button className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 w-fit">
              Submit Inquiry
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Info</h3>
          <p className="text-gray-700">Phone: +91-XXXXXXXXXX</p>
          <p className="text-gray-700">Email: info@effortedu.com</p>
          <p className="text-gray-700 mb-6">Address: New Delhi, India</p>

          <div className="w-full h-64 bg-gray-100 border rounded-md flex items-center justify-center text-gray-500">
            Map Placeholder
          </div>
        </div>
      </div>
    </section>
  );
}


