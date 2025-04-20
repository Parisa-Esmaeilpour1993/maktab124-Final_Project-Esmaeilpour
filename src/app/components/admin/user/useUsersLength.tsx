"use client";
import { getAuthToken } from "@/app/base/getAuthToken";
import { API_KEY, BASE_url } from "@/app/constants/api/BASE_URL";
import { UserProps } from "@/app/types/users";
import { adminEmails } from "@/app/utils/adminsEmail";
import axios from "axios";
import { useEffect, useState } from "react";

function useUsersLength() {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getAuthToken();
    const getUsersLength = async () => {
      try {
        const res = await axios.get(`${BASE_url}/api/admin/users`, {
          headers: {
            api_key: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });

        const adminEmailList = adminEmails.map((admin) => admin.email);

        const users = res.data.filter(
          (user: UserProps) => !adminEmailList.includes(user.email)
        );
        setUsersCount(users.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    console.log(usersCount);
    getUsersLength();
  }, []);

  if (loading) return null;

  return usersCount;
}

export default useUsersLength;
