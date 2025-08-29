export const throwError = (message = "Internal Server Error", status = 500) => {
  const err = new Error(message);
  err.status = status;
  throw err;
}