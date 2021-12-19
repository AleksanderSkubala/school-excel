import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ServiceContext } from "../../providers/ServiceProvider";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";

export default function Modal() {
  const { service, login } = useContext(ServiceContext);
  const [errors, setErrors] = useState({
    email: {
      message: ''
    }
  });
  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    login(data.email);
    // console.log(service.auth);
  };

  const onErr = err => {
    console.log(err);
    setErrors(err);
  };

  const formOpt = {
    required: "Email jest wymagany",
    pattern: {
      value: /^\S+@\S+$/i,
      message: "To nie jest email"
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-10/12 md:w-1/2 rounded shadow-md p-5">
        <form onSubmit={handleSubmit(onSubmit, onErr)}>
          <TextInput label="Twój mail służbowy" id="email" name="email" description="Jest on potrzebny do identyfikacji autora" error={errors.email.message} register={register} registerOpt={formOpt} />
          {/* <TextInput label="Twój mail służbowy" name="email" description="Jest on potrzebny do identyfikacji autora" register={() => register('email', { required: true })} registerOpt={{required: true, pattern: /^\S+@\S+$/i}} /> */}
          <div className="float-right mt-6 ml-3 md:mr-3">
            <Button primary="true" type="submit">
              Przejdź do panelu
            </Button>
          </div>
        </form>
     </div>
    </div>
  );
}