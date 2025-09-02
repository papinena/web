import { updateAdmin, type UpdateAdminPayload } from "~/services/update-admin";
import { EmployeeMapper } from "~/mappers/employee";
import { CondominiumAdministratorMapper } from "~/mappers/condominium-administrator";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import { useAuth } from "~/hooks/useAuth";
import { useToastStore } from "~/stores/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const createEmployeesMutation = useMutation({
    mutationFn: createEmployees,
    onSuccess: (data) => {
      onCreateEmployeesSuccess && onCreateEmployeesSuccess(data);
      addToast({ title: "Sucesso!", description: "Funcionário criado" });
    },
    onError: onCreateEmployeesError,
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
    },
    onSuccess: onCreateSuccess,
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
    }: {
      form: FulFillEmployeeType;
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
        } else if (form.avatar === null) {
          avatarFilename = null;
        }

        const payload = EmployeeMapper.toAPI({
          ...form,
          avatar: avatarFilename ? avatarFilename : undefined,
          birthDate: form.birthDate ? new Date(form.birthDate) : undefined,
          isRegisterCompleted: true,
        });

        return await fulfillAdmin(payload);
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
      setAuthEmployeeData(data);
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
      addToast({ title: "Sucesso!", description: "Informações salvas" });
    },
  });

  return {
    updateAdminDashBoard,
    useUpdateForm,
    fulFillEmployeeMutation,
    createAdminMutation,
    createEmployeesMutation,
  };
}
