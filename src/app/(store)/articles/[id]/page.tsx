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
    <div className="p-8 md:p-16 border-t-2 border-secondary mx-4">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        {blog.title}
      </h1>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-5 lg:gap-6 xl:gap-20 mb-8">
        <div className="mb-8 col-span-3 self-center mt-8 ">
          <p className="text-xl font-semibold text-primary">
            {blogLocalization.abstract}
          </p>
          <div className="max-w-none text-justify leading-loose">
            {blog.summary}
          </div>
        </div>
        <div className="flex justify-end mt-4 col-span-2">
          <img src={`${BASE_url}${blog.image}`} alt={blog.title} />
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold text-primary">
          {blogLocalization.content}
        </p>
        <div className="max-w-none text-justify leading-loose">
          {blog.content}
        </div>
      </div>
    </div>
  );
}
