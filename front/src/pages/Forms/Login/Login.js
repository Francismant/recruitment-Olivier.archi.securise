import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../Register/Register.module.scss";

export default function Login({seeHomepage, getUser}) {
  const [feedback, setFeedBack] = useState("");
  const [feedbackGood, setFeedBackGood] = useState("");
  const[isSubmitted, setIsSubmitted] = useState(false)

  const yupSchema = yup.object({
    email: yup
      .string()
      .required("Le champ est obligatoire")
      .email("Vous devez saisir un email valide"),
    password: yup.string().required("Le champ est obligatoire"),
  });

  const defaultValues = {
    password: "",
    email: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupSchema),
  });

  async function submit(values) {
    try {
      setIsSubmitted(true)
      setFeedBack("");
      console.log(values);
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const newUser = await response.json();
        console.log("newUser", newUser);
        if (newUser.message) {
          setIsSubmitted(false);
          setFeedBack(newUser.message);
        } else {
          setFeedBackGood("Connexion réussie, vous allez être redirigé");
          reset(defaultValues);
          setIsSubmitted(true);
          console.log("User récupéré", newUser);
          let user = {};
          user.username = newUser[0].username;
          user.email = newUser[0].email;
          user.preference = newUser[0].preference;
          user.free = newUser[0].free === 1 ? true : false;
          user.skills = [];
          for (let i = 0; i < newUser.length; i++) {
            let level = newUser[i].level;
            let skill = newUser[i].nameSkill;
            user.skills.push({ level, skill });
          }
          // newUser.map((user, index) => (testUser.skills[index] = user.nameSkill));
          console.log("User modifié", user);
          reset(defaultValues);
          setTimeout(() => {
            seeHomepage();
            getUser(user);
          }, 3000);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitted(false)
    }
  }

  return (
    <div className="flex-fill d-flex flex-column justify-content-center align-items-center">
      <form onSubmit={handleSubmit(submit)}>
        <div className="d-flex flex-column mb10">
          <label htmlFor="email" className="mb10">
            Email
          </label>
          <input type="email" id="email" {...register("email")} />
          {errors?.email && (
            <p className={`${styles.feedback}`}>{errors.email.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb10">
          <label htmlFor="password" className="mb10">
            Password
          </label>
          <input type="password" id="password" {...register("password")} />
          {errors?.password && (
            <p className={`${styles.feedback}`}>{errors.password.message}</p>
          )}
        </div>
        {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
        {feedbackGood && (
          <p className={`${styles.feedbackGood} mb20`}>{feedbackGood}</p>
        )}
        <button className="btn btn-primary" disabled={isSubmitted}>
          Submit
        </button>
      </form>
    </div>
  );
}
