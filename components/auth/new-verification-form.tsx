"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";

 export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Token Ausente!");
      return; 
    }

    newVerification(token)
    .then((data) => {
      setSuccess(data.success);
      setError(data.error);
    })
    .catch(() => {
      setError("Algo está errado!");
    })
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirmando sua verificação"
      backButtonLabel="Voltar para o Login"
      backButtonHref="/auth/login"
      >
      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          <BeatLoader />
        )}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={success} />
        )}
      </div>
    </CardWrapper>
  )
 }