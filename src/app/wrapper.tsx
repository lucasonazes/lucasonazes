"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import React, { Suspense, useEffect } from "react";
import { Loader } from "@/components";
import { Toaster } from "react-hot-toast";
import {
  getAccessToken,
  getTokenCookie,
  setAccessToken,
  setUser,
} from "@/store/authSlice";
import { useLazyFetchUserInfoQuery } from "@/service/userAPI";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const tokenCookie = getTokenCookie();
  const reduxToken = useAppSelector(getAccessToken);
  const [fetchUserInfo] = useLazyFetchUserInfoQuery();

  const isSomeQueryPending = useAppSelector((state) =>
    Object.values(state.api.queries).some(
      (query) => query?.status === "pending"
    )
  );

  const isSomeRequestPending = useAppSelector((state) =>
    Object.values(state.api.mutations).some(
      (query) => query?.status === "pending"
    )
  );

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await fetchUserInfo(undefined).unwrap();
      if (res) {
        dispatch(
          setUser({
            name: res.name,
            email: res.email,
            birth_date: res.birth_date,
            gender: res.gender,
            phone: res.phone,
          })
        );
      }
    };
    if (reduxToken) {
      getUserInfo();
    }
  }, [reduxToken, dispatch, fetchUserInfo]);

  useEffect(() => {
    if (tokenCookie && !reduxToken) {
      dispatch(setAccessToken(tokenCookie));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenCookie, dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      {children}
      <Toaster />
      {(isSomeQueryPending || isSomeRequestPending) && <Loader />}
    </Suspense>
  );
};

export default Wrapper;
