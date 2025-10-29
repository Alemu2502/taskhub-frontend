import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function BlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 cursor-pointer h-full group">
        {blog.image && (
          <div className="aspect-video w-full overflow-hidden rounded-t-xl">
            <img 
              src={blog.image} 
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400 rounded-full">
              {blog.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {blog.readingTime}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          
          {blog.excerpt && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {blog.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>By {blog.author?.username || 'Admin'}</span>
            <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
