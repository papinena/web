import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "~/services/login";
import { LoginSchema, type LoginType } from "~/parsers/login";
import { firebaseService } from "~/lib/firebase";
import { saveFcmToken } from "~/services/save-fcm-token";
import { useGoogleLogin } from "@react-oauth/google";
import { socialLogin } from "~/services/social-login";
import { socialAppleLogin } from "~/services/social-apple-login";
import { EmployeeMapper } from "~/mappers/employee";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import { useState } from "react";
import { getImageReadToken } from "~/services/get-image-read-token";

import { useImageTokenStore } from "~/stores/image-token";

export function useLogin() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string>("");
  const setToken = useImageTokenStore((s) => s.setToken);
  const methods = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  });

  const adminLoginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { error, data } = await login({ ...credentials, type: "admin" });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result: any) => {
      if (result.error) {
        setFormError(result.error.message);
        return;
      }

      if (!result.employee.is_register_completed) {
        return navigate("/register/admin/fulfill", {
          state: { ...result, employee: EmployeeMapper.toUI(result.employee) },
        });
      }

      authLogin(result);
      // Store authentication data in localStorage and update state
      const token = await firebaseService.setup();

      if (token) {
        await saveFcmToken(token);
      }

      return navigate("/admin/dashboard");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const onAdminLoginSubmit = (data: LoginType) => {
    setFormError("");
    adminLoginMutation.mutate(data);
  };

  const userLoginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { error, data } = await login({ ...credentials, type: "user" });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result: any) => {
      if (result.error) {
        setFormError(result.error.message);
        return;
      }

      authLogin(result);

      const { data: tokenData, error: tokenError } = await getImageReadToken();

      if (tokenError || !tokenData) {
        console.error("Failed to get image read token:", tokenError);
      } else {
        setToken(tokenData);
      }

      // Store authentication data in localStorage and update state
      const token = await firebaseService.setup();

      if (token) {
        await saveFcmToken(token);
      }

      return navigate("/");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const adminSocialLoginMutation = useMutation({
    mutationFn: async (token: string) => {
      const { error, data } = await socialLogin({ token, type: "employee" });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result) => {
      if (!result) {
        return setFormError("Algo deu errado");
      }

      if (result.employee && !result.employee.is_register_completed) {
        return navigate("/register/admin/fulfill", {
          state: { ...result, employee: EmployeeMapper.toUI(result.employee) },
        });
      }

      if (result.isNew) {
        return navigate("/register/admin/social/form", {
          state: {
            ...result.profile,
          },
        });
      }

      authLogin(result);

      // Store authentication data in localStorage and update state
      const token = await firebaseService.setup();

      if (token) {
        await saveFcmToken(token);
      }

      return navigate("/admin/dashboard");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });
  const userSocialLoginMutation = useMutation({
    mutationFn: async (token: string) => {
      const { error, data } = await socialLogin({ token });

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: async (result) => {
      if (!result) {
        return setFormError("algo deu errado");
      }

      if (result.isNew) {
        return navigate("/register/user/social/form", {
          state: {
            ...result.profile,
          },
        });
      }
      // Store authentication data in localStorage and update state
      authLogin(result);

      const token = await firebaseService.setup();

      if (token) {
        await saveFcmToken(token);
      }

      return navigate("/");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const adminAppleLoginMutation = useMutation({
    mutationFn: async (token: string) => {
      const { error, data } = await socialAppleLogin({
        token,
        type: "employee",
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result) => {
      console.log(result);
      if (!result) {
        return setFormError("Algo deu errado");
      }

      if (result.employee && !result.employee.is_register_completed) {
        return navigate("/register/admin/fulfill", {
          state: { ...result, employee: EmployeeMapper.toUI(result.employee) },
        });
      }

      if (result.isNew) {
        return navigate("/register/admin/social/form", {
          state: {
            ...result.profile,
          },
        });
      }

      authLogin(result);

      // Store authentication data in localStorage and update state
      const token = await firebaseService.setup();

      if (token) {
        await saveFcmToken(token);
      }

      return navigate("/admin/dashboard");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });
  const userAppleLoginMutation = useMutation({
    mutationFn: async (token: string) => {
      const { error, data } = await socialAppleLogin({ token });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result) => {
      if (!result) {
        return setFormError("Algo deu errado");
      }

      if (result.isNew) {
        return navigate("/register/user/social/form", {
          state: {
            ...result.profile,
          },
        });
      }

      // Store authentication data in localStorage and update state
      authLogin(result);
      const token = await firebaseService.setup();

      if (token) {
        await saveFcmToken(token);
      }

      return navigate("/");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const userGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      userSocialLoginMutation.mutate(tokenResponse.access_token);
    },
    onError: () => {
      setFormError("Failed to login with Google");
    },
  });

  const adminGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      adminSocialLoginMutation.mutate(tokenResponse.access_token);
    },
    onError: () => {
      setFormError("Failed to login with Google");
    },
  });

  const onUserLoginSubmit = (data: LoginType) => {
    setFormError("");
    userLoginMutation.mutate(data);
  };

  return {
    onUserLoginSubmit,
    userGoogleLogin,
    userAppleLoginMutation,
    userLoginMutation,
    adminLoginMutation,
    adminAppleLoginMutation,
    userSocialLoginMutation,
    formError,
    methods,
    adminGoogleLogin,
    onAdminLoginSubmit,
    adminSocialLoginMutation,
  };
}
