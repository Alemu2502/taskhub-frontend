'use client';

import { useState } from 'react';
import { adminAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const platformOptions = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'other', label: 'Other' }
];

// Rich Quill toolbar config
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ]
};

export default function NewJobPage() {
  const [form, setForm] = useState({
    title: '',
    platform: '',
    reward: '',
    totalSlots: '',
    instructions: '',
    image: '',
    proofRequired: true
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-calc budget
  const totalBudget = (parseFloat(form.reward) > 0 && parseInt(form.totalSlots) > 0)
    ? (parseFloat(form.reward) * parseInt(form.totalSlots)).toFixed(2)
    : '';

  const requiredFields = ['title', 'platform', 'reward', 'totalSlots', 'instructions', 'image'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let field of requiredFields) {
      if (!form[field] || (typeof form[field] === "string" && form[field].trim() === "")) {
        toast.error("Please provide all required fields");
        return;
      }
    }
    setLoading(true);
    try {
      await adminAPI.createJob({
        ...form,
        reward: Number(form.reward),
        totalSlots: Number(form.totalSlots),
        proofRequired: !!form.proofRequired,
      });
      toast.success("Job created!");
      router.push("/dashboard/jobs");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto text-gray-800 text-bold bg-white p-8 rounded-2xl shadow mt-10 mb-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Job</h2>
      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label className="font-semibold block mb-2 text-gray-800 text-bold">Title*</label>
          <input
            className="taskhub-input w-full px-4 py-2 text-gray-800 text-bold rounded-lg border focus:outline-primary-600"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Job Title"
          />
        </div>
        <div>
          <label className="font-semibold block text-gray-800 text-bold mb-2">Platform*</label>
          <select
            className="taskhub-input w-full px-4 py-2 rounded-lg text-gray-800 text-bold border"
            value={form.platform}
            onChange={e => setForm({ ...form, platform: e.target.value })}
            required>
            <option value="">Select Platform</option>
            {platformOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-semibold block text-gray-800 text-bold mb-2">Reward (USD)*</label>
            <input
              className="taskhub-input w-full px-4 py-2 rounded-lg border text-gray-800 text-bold"
              type="number"
              value={form.reward}
              min={0}
              step="any"
              onChange={e => setForm({ ...form, reward: e.target.value })}
              required
              placeholder="0.05"
            />
          </div>
          <div className="flex-1">
            <label className="font-semibold block  text-gray-800 text-bold mb-2">Total Slots*</label>
            <input
              className="taskhub-input w-full px-4 py-2 rounded-lg border text-gray-800 text-bold"
              type="number"
              value={form.totalSlots}
              min={1}
              onChange={e => setForm({ ...form, totalSlots: e.target.value })}
              required
              placeholder="100"
            />
          </div>
          <div className="flex-1">
            <label className="font-semibold block mb-2 text-bold text-gray-800">Total Budget (auto)</label>
            <input
              className="bg-gray-100 w-full text-gray-800 text-bold px-4 py-2 rounded-lg border cursor-not-allowed"
              type="text"
              value={totalBudget}
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>
        <div>
          <label className="font-semibold  text-gray-800 text-bold block mb-3">Job Instructions*</label>
          <ReactQuill
          className='text-gray-800 text-bold'
            value={form.instructions}
            onChange={v => setForm({ ...form, instructions: v })}
            style={{ minHeight: "180px", marginBottom: "24px" }}
            modules={quillModules}
            placeholder="Describe the job and use highlight, color, etc"
          />
        </div>
        <div>
          <label className="font-semibold block text-gray-800 text-bold mb-2">Thumbnail Image*</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageChange}
            className="taskhub-input w-full px-4 py-2 text-gray-800 text-bold rounded-lg border"
          />
          {form.image &&
            <img src={form.image} alt="Thumbnail" className="mt-2  text-gray-800 text-bold w-44 h-28 object-cover rounded shadow" />
          }
        </div>
        <div>
          <label className="font-semibold block text-gray-800 text-bold mb-2">Proof Required?</label>
          <select
            className="taskhub-input w-full px-4 py-2 rounded-lg border text-gray-800 text-bold"
            value={form.proofRequired ? "true" : "false"}
            onChange={e => setForm({ ...form, proofRequired: e.target.value === "true" })}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="flex mt-8">
          <button
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-xl text-lg font-bold transition"
            type="submit"
          >
            {loading ? "Saving..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
