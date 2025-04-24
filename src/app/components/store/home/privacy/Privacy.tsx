"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_url, API_KEY } from "@/app/constants/api/BASE_URL";
import { getAuthToken } from "@/app/base/getAuthToken";
import {
  faLocalization,
  pageLocalization,
} from "@/app/constants/localization/fa/localization";
import { AboutUsData } from "@/app/types/adminGeneralPages";

function Privacy() {
  const [privacy, setPrivacy] = useState<AboutUsData>();
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_url}/api/records/privacy`, {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.records && res.data.records.length > 0) {
          setPrivacy(res.data.records[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">{faLocalization.loading}</div>;

  return (
    <div className="p-6 border-t-2 border-secondary mx-4">
      <h1 className="text-center text-2xl font-extrabold mb-4">
        {pageLocalization.privacy}
      </h1>
      <h1 className="text-xl font-semibold mb-4">{privacy?.title}</h1>
      {privacy ? (
        <div
          className="text-sm text-gray-700 whitespace-pre-line leading-7"
          dangerouslySetInnerHTML={{ __html: privacy.description }}
        />
      ) : (
        <p>{faLocalization.noData}</p>
      )}
    </div>
  );
}

export default Privacy;
