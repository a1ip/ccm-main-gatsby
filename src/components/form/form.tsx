import { ReactElement, useState, PropsWithChildren, useEffect } from "react"
import React from "react"
import Field from "./field"
import { useForm } from "react-hook-form"

import formStyles from "./form.module.scss"
import classNames from "classnames"
import { ValidationOptions } from "react-hook-form"
import Section from "../section"

export function isFieldRequired(
    validationOptions?: ValidationOptions
): boolean {
    return (
        validationOptions != null &&
        validationOptions?.required != null &&
        validationOptions?.required !== false
    )
}

export function prependRequired(
    validationOptions?: ValidationOptions,
    contextualHelp?: string
): string {
    if (isFieldRequired(validationOptions)) {
        if (contextualHelp !== undefined) {
            return "Required. " + contextualHelp
        } else {
            return "Required."
        }
    }
    return contextualHelp ?? ""
}

export type FormState =
    | "filling"
    | "submitting"
    | "submitted"
    | "error"
    | "badconfig"

interface FormProps<DataType> {
    genericSubmissionErrorMessage: string
    doSubmit: (data: DataType) => Promise<void>
    stateChangeCallback: (state: FormState) => void
}

export type FormType<DataType> = PropsWithChildren<FormProps<DataType>>

export const Form = <DataType,>({
    genericSubmissionErrorMessage,
    doSubmit,
    stateChangeCallback,
    children,
}: PropsWithChildren<FormProps<DataType>>) => {
    const [formState, setFormState] = useState<FormState>("filling")
    const { register, handleSubmit, watch, errors, control } = useForm<
        DataType
    >()

    useEffect(() => {
        stateChangeCallback(formState)
    }, [formState, stateChangeCallback])

    const fieldsWithFormWiringInjected = React.Children.map(
        children as React.ReactElement,
        (child: ReactElement) =>
            React.cloneElement(child, {
                register: register,
                control: control,
                watch: watch,
                errors: errors,
            })
    )

    const submitHandler = (data: DataType) => {
        setFormState("submitting")
        doSubmit(data)
            .then(() => {
                setFormState("submitted")
            })
            .catch(() => {
                setFormState("error")
            })
    }

    const form = (
        <div className={formStyles.form}>
            <form
                onSubmit={handleSubmit(submitHandler)}
                method="post"
                className="validate"
                target="_blank"
                noValidate={false}
            >
                {fieldsWithFormWiringInjected}
                <Field error={undefined}>
                    <input
                        type="submit"
                        value={
                            formState === "submitting"
                                ? "Submitting..."
                                : "Submit"
                        }
                        name="submit"
                        id="submit"
                        className={classNames(
                            formStyles.submitButton,
                            "button"
                        )}
                        disabled={formState === "submitting"}
                    />
                    {formState === "error" && (
                        <div className={formStyles.formSubmissionError}>
                            {genericSubmissionErrorMessage}
                        </div>
                    )}
                </Field>
            </form>
        </div>
    )

    const submitted = (
        <>
            <h2>Form Submitted</h2>
            <p>Your information was submitted successfully. Thank you.</p>
            <p>
                If you wish to submit this form again, please refresh or reload
                the page.
            </p>
        </>
    )

    const badlyConfiguredForm = (
        <>
            <h2>Form Configuration Error</h2>
            <p>Sorry. There is a problem with the form configuration.</p>
            <p>
                The config name is:{" "}
                <code>
                    {process.env.GATSBY_GIVING_FORM_CONFIG ?? "undefined"}
                </code>
            </p>
            <p>
                Please inform the technical contact listed at the bottom of this
                page.
            </p>
        </>
    )

    return (
        <Section>
            <article>
                {formState === "badconfig" ? badlyConfiguredForm : null}
                {formState === "submitted" ? submitted : form}
            </article>
        </Section>
    )
}
