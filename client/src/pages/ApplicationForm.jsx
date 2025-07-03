import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

const AdoptionForm = ({ petName, user }) => {
  const [form, setForm] = useState({
    fullName: user?.name || "",
    contact: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName || !form.contact || !form.reason) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Adoption request submitted! We'll get back to you soon.");
      setForm({ fullName: user?.name || "", contact: "", reason: "" });
    }, 1000);
  };

  return (
    <div className="mt-10 p-6 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-amber-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Apply to Adopt {petName}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Information</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            type="text"
            className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Email or Phone"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Why do you want to adopt?</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Share your reason..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {submitting ? (
            <>
              <CheckCircle className="w-5 h-5 animate-pulse mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdoptionForm;
