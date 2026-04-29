// react imports...
import toast from "react-hot-toast";

// react hook form imports...
import { FormProvider, useForm } from "react-hook-form";

// shadcn components imports...
import { Label } from "../ui/label";
import { Input } from "../ui/input";

// rtk mutations...
import { useRegisterMutation } from "@/redux/auth";

// interface for registering a user.
interface IRegister {
  username: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const form = useForm<IRegister>();


  // register user mutations.
  const [registerUser, { isLoading }] = useRegisterMutation();

  // form state destructoring...
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // onSubmit handler
  const onSubmit = handleSubmit(async (values: IRegister) => {
  console.log("FORM SUBMITTED", values);

  try {
    await handleRegister(values);
    toast.success("Account created!");
  } catch (error: any) {
    console.log("REGISTER ERROR:", error);
    toast.error(error?.data?.message || "Something went wrong!");
  }
});

  const handleRegister = async (values: IRegister) => {
  console.log("CALLING MUTATION...");

  const res = await registerUser(values).unwrap();

  console.log("RESPONSE:", res);
};
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="">
          <Label className="font-normal text-base">
            Username
            <Input
              placeholder="@username"
              type="text"
              className="mt-2"
              {...register("username", { required: "username is required!" })}
            />
            {errors.username && (
              <span className="error_msg_state">{errors.username.message}</span>
            )}
          </Label>
        </div>

        <div className="">
          <Label className="font-normal text-base">
            Email
            <Input
              placeholder="example@gmail.com"
              type="email"
              className="mt-2"
              {...register("email", { required: "email is required!" })}
            />
            {errors.email && (
              <span className="error_msg_state">{errors.email.message}</span>
            )}
          </Label>
        </div>

        <div className="">
          <Label className="font-normal text-base">
            Password
            <Input
              placeholder="******"
              type="password"
              className="mt-2"
              {...register("password", {
                required: "password is required!",
                validate: (password) => {
                  if (password.length < 6) {
                    return "Password must be at least 6 characters!";
                  } else {
                    return true;
                  }
                },
              })}
            />
            {errors.password && (
              <span className="error_msg_state">{errors.password.message}</span>
            )}
          </Label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
         {isLoading ? "Creating..." : "Register"}
        </button>
      </form>
    </FormProvider>
  );
};
export default RegisterForm;
