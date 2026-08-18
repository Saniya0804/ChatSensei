//this file store where the user index live so both uploadcontroller and chatcontroller can use it without duplicating code
import path from "path";
import fs from "fs/promises";

export const VECTOR_STORE_DIR = path.resolve("vector_stores");
/*path.resolve("vector_stores") takes the string "vector_stores" and turns it into a full absolute path based on where your server process is currently running from.
Example: if you start your server with node server.js from inside C:\Users\saniy\Downloads\ChatSensei\server, then:
path.resolve("vector_stores") will return C:\Users\saniy\Downloads\ChatSensei\server\vector_stores. This is useful because it allows you to reference the vector_stores directory without worrying about the current working directory of your process.*/

export const getUserStorePath = (userId) => {
  return path.join(VECTOR_STORE_DIR, `user_${userId}`);
};

/*This is a function that takes one input (userId, e.g. 3) and gives back a path specific to that user.
getUserStorePath(3)
// = path.join("C:\...\server\vector_stores", "user_3")
// = "C:\...\server\vector_stores\user_3"

This is just a string — calling this function doesn't create anything on disk and also not telling weather this file exist or not. It only tells you where that user's folder would be, so other code (like fs.mkdir) can go create it there.*/

export const storeExists = async (storePath) => {
  try {
    await fs.access(path.join(storePath, "hnswlib.index"));
    return true;
  } catch {
    return false;
  }
};
/*This function answers one question: "Does this user already have a saved index on disk, or not?"

Breaking it down piece by piece:

async (storePath) => { ... } — this is a function that does something that takes time (checking the disk), so it's marked async. That means whoever calls it needs to await it, or handle it as a Promise.

fs.access(...) — checks whether a specific file exists and is accessible. Here we check for hnswlib.index specifically, since that's one of the files HNSWLib.save() writes out — if that file is there, we can safely assume the whole index was saved.

path.join(storePath, "hnswlib.index") — builds the full path to that specific file, e.g.:
So this whole function is really just: "try to touch this file — if it works, say yes; if it errors out, say no."

await in front of fs.access(...) means "pause this function here until the check finishes," since checking the disk isn't instant.

How these three pieces work together in practice

Say userId = 3 and this is their first ever upload.

uploadController.js calls getUserStorePath(3) → gets back "...\vector_stores\user_3"
It calls storeExists("...\vector_stores\user_3") → tries to check for hnswlib.index inside that folder → the folder doesn't even exist yet, so fs.access throws → storeExists returns false
Since it's false, the upload code knows: "no index yet, create a brand new one" → calls HNSWLib.fromDocuments(...) and then .save(storePath), which creates the folder and writes hnswlib.index (and other files) into it

Now say userId = 3 uploads a second PDF later.

getUserStorePath(3) → same path as before
storeExists(...) → this time hnswlib.index does exist → returns true
Upload code knows: "index already exists, load it and add to it" → calls HNSWLib.load(storePath, embeddings) then .addDocuments(...) then .save(storePath) again
And when chatController.js's ask function runs:

getUserStorePath(userId) → same helper, same logic
storeExists(...) → checks if there's anything to even search through
If false → respond with "no PDF found, upload one first"
If true → HNSWLib.load(storePath, embeddings) → search happens fast, since nothing needs to be re-parsed or re-embedded
*/