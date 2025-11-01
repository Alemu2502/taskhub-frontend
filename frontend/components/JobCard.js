import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job }) {
  const image = job.image || '/images/job-default.jpg';
  const totalSlots = typeof job.totalSlots === "number" ? job.totalSlots : Number(job.totalSlots) || 0;
  const filledSlots = typeof job.filledSlots === "number" ? job.filledSlots : Number(job.filledSlots) || 0;
  const availableVacancy = Math.max(0, totalSlots - filledSlots);

  return (
    <Link href={`/jobs/${job._id}`} className="block text-gray-800 text-bold hover:shadow-lg transition">
      <div className="flex flex-col shadow rounded-lg overflow-hidden bg-white cursor-pointer hover:scale-[1.01] transition">
        <div className="w-full aspect-[16/9] bg-gray-200 relative">
          <img
            src={image}
            alt={job.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
            draggable="false"
          />
        </div>
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
          <h3 className="text-base font-bold mb-1">{job.title}</h3>
         <div className="text-xs text-primary-600 font-semibold mb-2">
          published at: {job.createdAt ? format(new Date(job.createdAt), "yyyy-MM-dd hh:mm a") : ''}
        </div>

          {/* Big company style: Vacancy Ava line */}
          <div className="mb-3 text-[15px] font-bold text-primary-600 tracking-wide">
            AVAILABL&nbsp;VACANCY : <span className={availableVacancy > 0 ? "text-green-600" : "text-red-500"}>
              {availableVacancy}
            </span>
          </div>
          <div className="flex-1" />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">${Number(job.reward).toFixed(2)}</span>
            <span className={`px-4 py-2 rounded text-sm font-medium transition 
              ${availableVacancy>0 ? "bg-primary-600 hover:bg-primary-700 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}>
              Apply Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
