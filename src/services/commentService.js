import * as request from "./requester";

const baseUrl = "http://localhost:3030/data/comments";

export const create = (recipeId, comment) =>
    request.post(baseUrl, { recipeId, text: comment });

export const getByRecipeId = (recipeId) => {
    const relations = encodeURIComponent("user=_ownerId:users");
    const search = encodeURIComponent(`recipeId="${recipeId}"`);

    return request.get(`${baseUrl}?where=${search}&load=${relations}`);
};
