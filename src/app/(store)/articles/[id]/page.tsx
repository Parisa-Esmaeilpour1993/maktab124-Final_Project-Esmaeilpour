import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { blogLocalization } from "@/app/constants/localization/fa/localization";
import axios from "axios";

interface BlogPageProps {
  params: { id: string };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const token = getAuthToken();
  const res = await axios.get(`${BASE_url}/api/records/blogs/${params.id}`, {
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  const blog = res.data;

  return (
    <div className="p-16 border-t-2 border-secondary mx-4">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        {blog.title}
      </h1>

      <div className="grid grid-cols-5 gap-20">
        <div className="mb-8 col-span-3 self-center">
          <p className="text-xl font-semibold text-primary">
            {blogLocalization.abstract}
          </p>
          <div
            className="max-w-none text-justify leading-loose"
            dangerouslySetInnerHTML={{ __html: blog.summary }}
          />
        </div>
        <div className="flex justify-end col-span-2">
          <img src={`${BASE_url}${blog.image}`} alt={blog.title} className="" />
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold text-primary">
          {blogLocalization.content}
        </p>
        <div
          className="max-w-none text-justify leading-loose"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
