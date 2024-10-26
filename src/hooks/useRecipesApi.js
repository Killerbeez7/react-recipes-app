// const url = 'http://localhost:3030/jsonstore/recipes';

// const useRecipesApi = () => {
//     const addRecipe = (newRecipe) => {
//         return fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(newRecipe),
//         }).then((res) => res.json());
//     };

//     const editRecipe = (recipeId, recipeData) => {
//         return fetch(`${url}/${recipeId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(recipeData),
//         }).then((res) => res.json());
//     };

//     const deleteRecipe = (recipeId) => {
//         return fetch(`${url}/${recipeId}`, {
//             method: 'DELETE',
//         }).then((res) => res.json());
//     };

//     return {
//         addRecipe,
//         editRecipe,
//         deleteRecipe,
//     };
// };

// export default useRecipesApi;
