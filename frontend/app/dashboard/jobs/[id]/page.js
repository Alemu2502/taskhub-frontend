'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from "../../../../lib/api";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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

const platformOptions = [
  "youtube", "tiktok", "instagram", "facebook", "twitter", "telegram", "other"
];

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    platform: "",
    reward: "",
    totalSlots: "",
    instructions: "",
    proofRequired: true,
    image: ""
  });

  useEffect(() => {
    if (!id) return;
    adminAPI.getJobById(id)
      .then(res => {
        const job = res.data.data;
        setForm({
          title: job.title ?? "",
          platform: job.platform ?? "",
          reward: job.reward ?? "",
          totalSlots: job.totalSlots ?? "",
          instructions: job.instructions ?? "",
          proofRequired: job.proofRequired !== false,
          image: job.image ?? ""
        });
      })
      .catch(() => toast.error("Failed to load job"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateJob(id, { ...form, reward: Number(form.reward), totalSlots: Number(form.totalSlots) });
      toast.success("Job updated!");
      router.push("/dashboard/jobs");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="p-16 text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto text-gray-800 text-bold  bg-white p-8 rounded-2xl shadow mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-6">Edit Job</h2>
      <form onSubmit={handleUpdate} className="space-y-7">
        <div>
          <label className="font-semibold block mb-2">Title</label>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border"
            required
          />
        </div>
        <div>
          <label className="font-semibold block mb-2">Platform</label>
          <select
            className="w-full px-4 py-2 rounded-lg border"
            value={form.platform}
            onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
            required
          >
            <option value="">Select One</option>
            {platformOptions.map(opt =>
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            )}
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-2">Reward (USD)</label>
          <input
            type="number"
            value={form.reward}
            min="0.01"
            step="0.01"
            onChange={e => setForm(f => ({ ...f, reward: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border"
            required
          />
        </div>
        <div>
          <label className="font-semibold block mb-2">Total Slots</label>
          <input
            type="number"
            value={form.totalSlots}
            min="1"
            onChange={e => setForm(f => ({ ...f, totalSlots: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border"
            required
          />
        </div>
        <div>
          <label className="font-semibold block mb-2">Instructions</label>
          <ReactQuill
            theme="snow"
            value={form.instructions}
            onChange={val => setForm(f => ({ ...f, instructions: val }))}
            modules={quillModules}
            className="bg-white"
            style={{ minHeight: "160px", marginBottom: "8px" }}
          />
        </div>
        <div>
          <label className="font-semibold block mb-2">Proof Required?</label>
          <select
            className="w-full px-4 py-2 rounded-lg border"
            value={form.proofRequired ? "true" : "false"}
            onChange={e => setForm(f => ({ ...f, proofRequired: e.target.value === "true" }))}
          >
            <option value="true">Required</option>
            <option value="false">Optional</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-2">Thumbnail Image</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageChange}
            className="w-full px-4 py-2 rounded-lg border"
          />
          {form.image && (
            <img src={form.image} alt="Thumbnail" className="mt-2 w-48 h-32 object-cover rounded shadow" />
          )}
        </div>
        <div className="pt-4">
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-lg font-bold transition" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
