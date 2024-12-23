export const appConfig = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
export const error = {
  422: "Validasiya Xətası!",
  409: "Bu istifadəçi artıq mövcuddur!",
  500: "Server xətası!",
  404: "Bu istifadəçi tapılmadı",
  403: "İcazəniz yoxdur",
  400: "Səhv sorğu! Tələb olunan məlumat çatışmır və ya yanlışdır.",
};
