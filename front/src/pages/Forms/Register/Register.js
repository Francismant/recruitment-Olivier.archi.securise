import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Register.module.scss";

export default function Register({ seeLoginForm }) {
  // on récupére toutes les compétences que l'on va stocker dans ce useState
  const [allTheSkills, setAllTheSkills] = useState([]);
  // useState pour l'erreur ou la validation provenant de l'API
  const [feedback, setFeedBack] = useState("");
  const [feedbackGood, setFeedBackGood] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function getSkills() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/skills/getSkills"
        );
        if (response.ok) {
          const skills = await response.json();
          console.log(skills);
          setAllTheSkills(skills);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getSkills();
  }, []);

  const yupSchema = yup.object({
    username: yup
      .string()
      .required("Le champ est obligatoire")
      .min(2, "Le champ doit contenir au minimum 2 caractères")
      .max(12),
    email: yup
      .string()
      .required("Le champ est obligatoire")
      .email("Vous devez saisir un email valide"),
    password: yup
      .string()
      .required("Le champ est obligatoire")
      .min(5, "Mot de passe trop court")
      .max(10, "Mot de passe trop long"),
    confirmPassword: yup
      .string()
      .required("Vous devez confirmer votre mot de passe")
      .oneOf(
        [yup.ref("password", "")],
        "Les mots de passe ne correspondent pas"
      ),
  });

  // valeurs par défaut de notre formulaire d'inscription
  const defaultValues = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    preference: "home",
    free: false,
    skills: [],
  };

  // register pour connecter les input et recupérer leurs valeurs
  // handleSublit qui va gérer la méthode de soumission
  // reset pour vider les champs après soumission du formulaire
  // control pour connecter les champs dynamiques avec useFieldArray à useForm
  // errors pour le feedback des erreurs
  // isSubmitting pour éviter de valider plusieurs fois le formulaire
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupSchema),
  });

  // fields est le tableau sur lequel nous allons boucler pour afficher les inputs dynamiques
  // append permet d'ajouter les valeurs à notre tableau
  // remove permet de les supprimer
  const { fields, append, remove } = useFieldArray({
    name: "skills",
    control,
  });

  // il ne sera invoqué que si aucune erreur n'a été rencontré
  // c'est à cet endroit que vous placez votre requete HTTP de type POST pour insérer en BDD en passant par votre API
  async function submit(values) {
    try {
      setIsSubmitted(true);
      setFeedBack("");
      console.log(values);
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const newUser = await response.json();
        // console.log("newUser", newUser);
        if (newUser.message) {
          setFeedBack("Email déjà existant");
        } else {
          setFeedBackGood(newUser.messageGood);
          reset(defaultValues);
          setTimeout(() => {
            seeLoginForm();
          }, 3000);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitted(false);
    }
  }

  // ajout de nos compétences dans le tableau, on définit nos valeurs par défaut
  function addSkill() {
    append({
      value: "",
      level: "",
    });
  }

  // fonction pour supprimer un de nos champs dynamiques
  function deleteSkill(id) {
    remove(id);
  }

  return (
    <div className="flex-fill d-flex flex-column justify-content-center align-items-center">
      <form onSubmit={handleSubmit(submit)}>
        <div className="d-flex flex-column mb10">
          <label htmlFor="username" className="mb10">
            Username
          </label>
          <input type="text" id="username" {...register("username")} />
          {errors?.username && (
            <p className={`${styles.feedback}`}>{errors.username.message}</p>
          )}
        </div>
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
        <div className="d-flex flex-column mb10">
          <label htmlFor="confirmPassword" className="mb10">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          {errors?.confirmPassword && (
            <p className={`${styles.feedback}`}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="d-flex flex-column mb10">
          <label htmlFor="preference">Préférence</label>
          <div>
            <label htmlFor="home">Présentiel</label>
            <input
              type="radio"
              value="home"
              id="home"
              {...register("preference")}
            />
          </div>
          <div>
            <label htmlFor="away">Distanciel</label>
            <input
              type="radio"
              value="away"
              id="away"
              {...register("preference")}
            />
          </div>
        </div>
        <div className="d-flex flex-column mb10">
          <label htmlFor="free" className="mb10">
            Libre ?
            <input type="checkbox" id="free" {...register("free")} />
          </label>
        </div>
        <div className="d-flex flex-column mb10">
          <label className="mb10 d-flex justify-content-center align-items-center">
            <span className="flex-fill">Compétences</span>
            <button
              onClick={addSkill}
              type="button"
              className="btn btn-primary-reverse"
            >
              +
            </button>
          </label>
          <ul>
            {fields.map((skill, index) => (
              <li key={skill.id} className="mb10">
                <select
                  className="mr10"
                  {...register(`skills[${index}].value`)}
                >
                  {allTheSkills.map((skill) => (
                    <option key={skill.idSkill} value={skill.idSkill}>
                      {skill.nameSkill}
                    </option>
                  ))}
                </select>
                <select
                  className="mr10"
                  {...register(`skills[${index}].level`)}
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="expert">Confirmé</option>
                </select>
                <button
                  onClick={() => deleteSkill(index)}
                  className="btn btn-primary"
                >
                  -
                </button>
              </li>
            ))}
          </ul>
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
