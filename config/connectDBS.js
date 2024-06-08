import mongoose from "mongoose";

const connectDatabase = () => {
  // mongoose.set('strictQuery', false).
  mongoose
    .connect(process.env.URI_MONGO, {
      useNewUrlparser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `Server is Connected Successfully Host is ${data.connection.host}`
      );
    });
};

export default connectDatabase;