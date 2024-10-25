// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import * as recipeService from "../../../services/recipeService";
// import * as commentService from "../../../services/commentService";

// import { useContext } from "react";
// import { RecipeContext } from "../../../contexts/RecipeContext";
// // import { AuthContext } from "../../../contexts/AuthContext";

// import styles from "./RecipeDetails.module.css";

// export const RecipeDetails = () => {
//     const { user } = useContext(AuthContext);
//     const { deleteRecipe, addComment, fetchRecipeDetails, selectRecipe } =
//         useContext(RecipeContext);
//     const { recipeId } = useParams();

//     const currentRecipe = selectRecipe(recipeId);

//     const isOwner = currentRecipe._ownerId === user._id;

//     useEffect(() => {
//         (async () => {
//             const recipeDetails = await recipeService.getOne(recipeId);
//             const recipeComments = await commentService.getByRecipeId(recipeId);

//             fetchRecipeDetails(recipeId, {
//                 ...recipeDetails,
//                 comments: recipeComments.map(
//                     (x) => `${x.user.username}: ${x.text}`
//                 ),
//             });
//         })();
//     }, []);

//     const addCommentHandler = (e) => {
//         e.preventDefault();

//         const formData = new FormData(e.target);

//         const comment = formData.get("comment");

//         commentService.create(recipeId, comment).then((result) => {
//             addComment(recipeId, comment);
//         });

//         e.target["comment"].value = "";
//     };

//     const deleteRecipeHandler = () => {
//         const confirmation = window.confirm(
//             "Are you sure you want to delete this recipe?"
//         );
//         if (confirmation) {
//             recipeService.remove(recipeId).then(deleteRecipe(recipeId));
//         }
//     };

//     return (
//         <>
//             <div className={styles["recipe-details-wrapper"]}>
//                 <h1 className={styles["recipe-title"]}>
//                     Recipe: {currentRecipe.name}
//                 </h1>
//                 <hr />
//                 <br />
//                 <div>
//                     <div className="recipe-img-box">
//                         <img
//                             src={`${currentRecipe.imageUrl}`}
//                             alt=""
//                             className={styles["recipe-img"]}
//                         />
//                     </div>
//                     <div className={styles["recipe-details-box"]}>
//                         <p>
//                             <strong>Description: </strong>
//                             {currentRecipe.description}
//                         </p>
//                         <p>
//                             <strong>Time for preparation: </strong>
//                             {currentRecipe.timeToCook} minutes
//                         </p>
//                         <p>
//                             <strong>ingredients: </strong>
//                             {currentRecipe.ingredients}
//                         </p>
//                         <br></br>
//                         <h2>Likes: </h2>
//                     </div>
//                 </div>
//                 <div className={styles["form-control"]}>
//                     {user.email && (
//                         <span>
//                             <Link
//                                 to={`/recipes/details/${currentRecipe._id}`}
//                                 className={styles.btn}
//                             >
//                                 LIKE
//                             </Link>
//                             {isOwner && (
//                                 <span>
//                                     <Link
//                                         className={styles.btn}
//                                         to={`/recipes/edit/${currentRecipe._id}`}
//                                         recipe={currentRecipe}
//                                     >
//                                         Edit
//                                     </Link>

//                                     <Link
//                                         className={styles.btn}
//                                         to={`/recipes/list`}
//                                         onClick={() =>
//                                             deleteRecipeHandler(
//                                                 currentRecipe._id
//                                             )
//                                         }
//                                     >
//                                         Delete
//                                     </Link>
//                                 </span>
//                             )}
//                         </span>
//                     )}
//                 </div>
//                 <div>
//                     <hr />
//                     <h3>Comments:</h3>
//                     <ul className="comments">
//                         {currentRecipe.comments?.map((x) => (
//                             <li key={x} className="comment">
//                                 <p>{x}</p>
//                             </li>
//                         ))}
//                     </ul>
//                     {!currentRecipe.comments && <p>No comments yet!</p>}
//                 </div>
//                 {user.email && (
//                     <div className={styles["create-comment"]}>
//                         <article className={styles["comments-section"]}>
//                             <label
//                                 htmlFor="comment"
//                                 className={styles["comments-title"]}
//                             >
//                                 Add new comment
//                             </label>
//                             <form className="form" onSubmit={addCommentHandler}>
//                                 <textarea
//                                     className={
//                                         styles["create-comment-text-area"]
//                                     }
//                                     name="comment"
//                                     id="comment"
//                                     placeholder="Comment..."
//                                 />
//                                 <div>
//                                     <input
//                                         className={styles["comment-btn"]}
//                                         type="submit"
//                                         value="Add comment"
//                                     />
//                                 </div>
//                             </form>
//                         </article>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };
