import { updateAdmin, type UpdateAdminPayload } from "~/services/update-admin";
import { EmployeeMapper } from "~/mappers/employee";
import { CondominiumAdministratorMapper } from "~/mappers/condominium-administrator";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import { useAuth } from "~/hooks/useAuth";
import { useToastStore } from "~/stores/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateAdminType } from "~/parsers/update-admin";
import { DateFormatter } from "~/utils/date-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fulfillAdmin } from "~/services/fulfill-admin";
import {
  FulFillEmployeeSchema,
  type FulFillEmployeeType,
} from "~/parsers/update-employee";
import type { CreateAdminType } from "~/parsers/create-admin";
import { createAdmin } from "~/services/create-admin";
import { createEmployees } from "~/services/create-employees";
import { getCondominiumEmployees } from "~/services/get-condominium-employees";
import { updateEmployees } from "~/services/update-employees";
import { firebaseService } from "~/lib/firebase";
import { saveFcmToken } from "~/services/save-fcm-token";
import { getImageReadToken } from "~/services/get-image-read-token";
import { useImageTokenStore } from "~/stores/image-token";
import { useNavigate } from "react-router";
import type { CreateSocialAdminType } from "~/parsers/create-social-admin";
import { createSocialAdmin } from "~/services/create-social-admin";
import { deleteEmployeeAccount } from "~/services/delete-employee-account";

type Props = {
  onFulFillSuccess?(data: any): void;
  onCreateSuccess?(data: any): void;
  onCreateEmployeesSuccess?(data: any): void;
  onCreateEmployeesError?(data: any): void;
};

export function useEmployee({
  onFulFillSuccess,
  onCreateSuccess,
  onCreateEmployeesSuccess,
  onCreateEmployeesError,
}: Props = {}) {
  const { setAuthEmployeeData } = useAuth();
  const addToast = useToastStore((s) => s.addToast);
  const { login: authLogin } = useAuth();
  const queryClient = useQueryClient();
  const setToken = useImageTokenStore((s) => s.setToken);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const deleteEmployeeAccountMutation = useMutation({
    mutationKey: ["DELETE-EMPLOYEE-ACCOUNT"],
    mutationFn: deleteEmployeeAccount,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.removeQueries();
        logout();
        navigate("/");
      }, 3000);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const updateEmployeesMutation = useMutation({
    mutationFn: async ({
      ids,
      data,
    }: {
      ids: string[];
      data: { active: boolean };
    }) => {
      return await updateEmployees({ ids, data });
    },
  });

  const getCondominiumEmployeesQuery = () =>
    useQuery({
      queryFn: async () => {
        const { data } = await getCondominiumEmployees();
        return data;
      },
      queryKey: ["CONDOMINIUM-EMPLOYEES"],
    });

  const createEmployeesMutation = useMutation({
    mutationFn: createEmployees,
    onSuccess: (data) => {
      onCreateEmployeesSuccess && onCreateEmployeesSuccess(data);
      addToast({ title: "Sucesso!", description: "Funcionário criado" });
    },
    onError: onCreateEmployeesError,
  });

  const createSocialAdminMutation = useMutation({
    mutationKey: ["CREATE-SOCIAL-ADMIN"],
    mutationFn: async (data: CreateSocialAdminType) => {
      let filename = "";
      let tokenData,
        tokenError: { status: string; message: string } | undefined;

      if (data.employee.photo) {
        const sasTokenData = await getSasToken();
        tokenData = sasTokenData.data;
        tokenError = sasTokenData.error;

        if (tokenError) throw new Error(tokenError.message);

        if (tokenData) {
          filename = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            data.employee.photo
          );
        }
      }

      const dataToSave = {
        ...data,
        employee: {
          ...data.employee,
          avatar: filename,
          birthDate: new Date(data.employee.birthDate),
        },
        employees: data.employees,
        condominiumAdministrator: data.condominiumAdministrator,
        condominium: data.condominium,
      };

      const res = await createSocialAdmin(dataToSave);

      console.log(res);
      if (res?.error?.status === "error") {
        tokenData &&
          filename &&
          (await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            filename
          ));
        throw new Error(res?.error?.message);
      }
      return res.data;
    },
    onSuccess: async (data) => {
      console.log(data);
      if (!data) return;

      const { employee, token } = data;

      authLogin({ employee, ...token, userType: "employee" });

      const { data: tokenData, error: tokenError } = await getImageReadToken();

      if (tokenError || !tokenData) {
        console.error("Failed to get image read token:", tokenError);
      } else {
        setToken(tokenData);
      }

      if (employee?.email) {
        try {
          const token = await firebaseService.setup();

          if (token) {
            await saveFcmToken(token);
          }
        } catch (error) {
          console.error(
            "Failed to setup or save FCM token on registration:",
            error
          );
        }
      }

      if (onCreateSuccess) {
        onCreateSuccess(data);
      }

      return navigate("/admin/dashboard");
    },
  });

  const createAdminMutation = useMutation({
    mutationKey: ["CREATE-ADMIN"],
    mutationFn: async (data: { form: CreateAdminType; file: File | null }) => {
      let filename = "";
      let tokenData,
        tokenError: { status: string; message: string } | undefined;

      if (data.file) {
        const sasTokenData = await getSasToken();
        tokenData = sasTokenData.data;
        tokenError = sasTokenData.error;

        if (tokenError) throw new Error(tokenError.message);

        if (tokenData) {
          filename = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            data.file
          );
        }
      }

      const dataToSave = {
        ...data.form,
        employee: {
          ...data.form.employee,
          photo: filename,
        },
      };

      const res = await createAdmin(dataToSave);

      if (res?.error?.status === "error") {
        tokenData &&
          filename &&
          (await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            filename
          ));
        throw new Error(res?.error?.message);
      }
      return res;
    },
    onSuccess: async (data) => {
      const { employee, token } = data.data;

      authLogin({ employee, ...token, userType: "employee" });

      const { data: tokenData, error: tokenError } = await getImageReadToken();

      if (tokenError || !tokenData) {
        console.error("Failed to get image read token:", tokenError);
      } else {
        setToken(tokenData);
      }

      if (employee?.email) {
        try {
          const token = await firebaseService.setup();

          if (token) {
            await saveFcmToken(token);
          }
        } catch (error) {
          console.error(
            "Failed to setup or save FCM token on registration:",
            error
          );
        }
      }

      if (onCreateSuccess) {
        onCreateSuccess(data);
      }

      return navigate("/admin/dashboard");
    },
  });

  const useUpdateForm = ({
    defaultValues,
  }: {
    defaultValues: FulFillEmployeeType;
  }) =>
    useForm<FulFillEmployeeType>({
      resolver: zodResolver(FulFillEmployeeSchema),
      defaultValues,
    });

  const fulFillEmployeeMutation = useMutation({
    mutationKey: ["UPDATE_ADMIN"],
    mutationFn: async ({
      form,
      file,
      token,
    }: {
      form: FulFillEmployeeType;
      file: File | null;
      token?: string;
    }) => {
      let avatarFilename: string | undefined | null = undefined;
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      try {
        if (file) {
          const sasTokenData = await getSasToken();
          tokenData = sasTokenData.data;
          tokenError = sasTokenData.error;

          if (tokenError) throw new Error(tokenError.message);
          if (!tokenData) throw new Error("Token data is undefined");

          avatarFilename = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            file
          );
        } else if (form.avatar === null) {
          avatarFilename = null;
        }

        const payload = EmployeeMapper.toAPI({
          ...form,
          avatar: avatarFilename ? avatarFilename : undefined,
          birthDate: form.birthDate ? new Date(form.birthDate) : undefined,
          isRegisterCompleted: true,
        });

        return await fulfillAdmin(payload, { token });
        // call service
      } catch (error) {
        if (tokenData && avatarFilename) {
          await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            avatarFilename
          );
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-edit-info"] });
      addToast({ title: "Sucesso!", description: "Informações salvas" });
      onFulFillSuccess && onFulFillSuccess(data);
    },
  });

  const updateAdminDashBoard = useMutation({
    mutationKey: ["UPDATE_ADMIN"],
    mutationFn: async ({
      form,
      file,
    }: {
      form: UpdateAdminType;
      file: File | null;
    }) => {
      let avatarFilename: string | undefined | null = undefined;
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      try {
        if (file) {
          const sasTokenData = await getSasToken();
          tokenData = sasTokenData.data;
          tokenError = sasTokenData.error;

          if (tokenError) throw new Error(tokenError.message);
          if (!tokenData) throw new Error("Token data is undefined");

          avatarFilename = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            file
          );
        } else if (form.employee.photo === null) {
          avatarFilename = null;
        }

        const payload: UpdateAdminPayload = {
          employee: EmployeeMapper.toAPI({
            ...form.employee,
            avatar: avatarFilename,
            birthDate: DateFormatter.parse(form.employee.birthDate),
          }),
        };

        if (form.condominium) {
          payload.condominium = form.condominium;
        }

        if (form.condominiumAdministrator) {
          payload.condominiumAdministrator =
            CondominiumAdministratorMapper.toAPI(form.condominiumAdministrator);
        }
        return await updateAdmin(payload);
      } catch (error) {
        if (tokenData && avatarFilename) {
          await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            avatarFilename
          );
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-edit-info"] });
      setAuthEmployeeData(data.data.employee.data);
      addToast({
        title: "Sucesso!",
        description: "Informações salvas",
        variant: "admin",
      });
    },
  });

  function handleInvalidateQuery(key: any) {
    queryClient.invalidateQueries(key);
  }

  return {
    updateAdminDashBoard,
    useUpdateForm,
    fulFillEmployeeMutation,
    createAdminMutation,
    createEmployeesMutation,
    getCondominiumEmployeesQuery,
    updateEmployeesMutation,
    handleInvalidateQuery,
    createSocialAdminMutation,
    deleteEmployeeAccountMutation,
  };
}
