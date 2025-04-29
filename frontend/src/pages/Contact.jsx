import { useRef } from "react";
import emailjs from "@emailjs/browser";
import FormInput from "../components/FormInput";
import EmailIcon from "../components/EmailIcon";
import { useAlert } from "../context/AlertContext";

export const ContactUs = () => {
  const form = useRef();
  const { showAlert } = useAlert();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_zorui8a", "template_vqjyspn", form.current, {
        publicKey: "4BRDR9QGrIRrgrJVS",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          showAlert("Message sent successfully!");
        },
        (error) => {
          console.log("FAILED...", error.text);
          showAlert("Message not sent :(");
        }
      );
  };

  return (
    <div className=" text-center relative px-24 text h-fit mb-12">
      <div>
        <h1 className="text-2xl pt-12 mb-4 font-semibold sm:text-3xl">
          Contact Us
        </h1>
        <form
          className="px-64 flex flex-col gap-6 "
          ref={form}
          onSubmit={sendEmail}
        >
          <FormInput name="name" placeholder="Name" id="name" type="text" />

          <FormInput
            name="email"
            placeholder="Email"
            id="email"
            type="email"
            icon={<EmailIcon />}
          />

          <FormInput
            name="phone"
            placeholder="Phone Number"
            id="phone"
            type="text"
          />

          <textarea
            type="text"
            className=" rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Message"
            name="message"
            rows="4"
          />

          <button
            className=" px-8 font-semibold py-2 bg-black rounded-3xl text-white hover:border-2 border-black hover:bg-white hover:text-black"
            type="submit"
            value="Send"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
