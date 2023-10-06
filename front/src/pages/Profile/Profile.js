export default function Profile({user}) {
  console.log("userProfile", user);
  return (
    <div className="flex-fill">
      <h1 className="ml20 my30">Profile</h1>
      <h2 className="ml20 mb10">username : {user.username}</h2>
      <h2 className="ml20 mb10">email : {user.email}</h2>
      <h2 className="ml20 mb10">preference : {user.preference === "home" ? "présentiel" : "distanciel"}</h2>
      <ul>
        <h2>Compétences</h2>
        {user.skills.map((skill, i) => (
          <li key={i} className="mb10">{skill.skill} || {skill.level}</li>
        ))}
      </ul>
      {/* Ajouter formulaire dynamique pour ajouter des skills (name + level)
      pouvoir modifier email (verifier que la nouvelle n'éxiste pas), username, prérérence
       et disponibilité update en base de données les modifications
       Dans register, faire en sorte que l'on ne peut pas choisir 2 fois la même compétence */}
    </div>
  );
}
