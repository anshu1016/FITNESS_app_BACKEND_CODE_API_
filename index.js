const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const cors = require('cors');

const userRouter = require("./routers/user.router.js");
// ...
// const TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MThmNGFhOGI3YmM4OThjOTk4YTE1NCIsImlhdCI6MTY5NjI0Mzk5MywiZXhwIjoxNjk2MjU4MzkzfQ.oJedX9mFoAFJq9-PNm6DOypErM74jH0_jTZ_Z4syxX4

//
const { initializeDatabase } = require("./db/db.js");
const { User } = require("./model/fitness.model.js");
// Middleware and Query Function Imports
const { authenticateJWT } = require("./middlewares/middlewares.js");
const { seedDataBase, getExercises, addExercise, deleteExercise, getAllFood, addFood, deleteFood, addGoal, getGoal, deleteGoal } = require("./queries/fitness.queries.js");



//MIDDLEWARES
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//BASIC TESTING
app.get("/test", (req, res) => {
  res.send("Test EndPoint");
})

//ROUTES
app.get("/", (req, res) => {
  res.send("Hello Express App!");
})
app.use('/api/users', userRouter);


//Initialize The Database
initializeDatabase();


//SEEDING THE DATABASE
// seedDataBase();

//CALLING THE FUNCTION

// const result= getExercises("john.doe@example.com","SecurePassword123");
// console.log(result,"RESULT")


app.post('/api/user/exercises', authenticateJWT, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await getExercises(email, password);

    if (result && result.exercises.length > 0) {
      return res.status(200).json({
        message: "User's Exercise Found.",
        email: email,
        data: result.exercises
      });
    } else {
      return res.status(200).json({
        message: "User doesn't have any exercises. Please add some."
      });
    }
  } catch (error) {
    if (error.message === "Email not found!") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "Incorrect Password!") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

//ADD EXERCISE
// const result = addExercise("john.doe@example.com","SecurePassword123",{
//   exerciseName: "running",
//   exerciseDuration: 15
// })

// console.log(result,"RESULTT 2")

app.post('/addExercise', authenticateJWT, async (req, res) => {
  // Validations
  if (!req.body.email || !req.body.password || !req.body.exercise) {
    return res.status(400).json({ message: "Email, password and exercise fields are required." });
  }

  const { email, password, exercise } = req.body;

  // Additional validations (for instance, you could validate the structure of 'exercise', etc.)

  try {
    const addedExercise = await addExercise(email, password, exercise);
    res.status(200).json({ success: true, data: addedExercise, message: "EXERCISE ADDED SUCCESFULLY" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//deleteExercise
// const result=  deleteExercise("john.doe@example.com","SecurePassword123","651900b6c9df428899e949ca")
// console.log(result,"RESULTT3")

app.delete('/api/deleteExercise', async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.exerciseId) {
    return res.status(400).json({ message: "Email, password, and exerciseId fields are required." });
  }

  const { email, password, exerciseId } = req.body;
  try {
    const deletedExercise = await deleteExercise(email, password, exerciseId);
    res.status(200).json({ success: true, message: "Exercise deleted successfully", deletedExercise });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


//GET ALL FOOD
// getAllFood("john.doe@example.com","SecurePassword123");

app.post('/api/food',authenticateJWT, async (req, res) => {
  // Validations
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Both email and password fields are required." });
  }

  const { email, password } = req.body;

  // Additional validations (for instance, you could validate the email format, etc.) can be added as needed

  try {
    const result = await getAllFood(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//addFood

// const result = addFood("john.doe@example.com","SecurePassword123",{
//   foodName:"Kadhai Chicken",
//   calories:200,
//   protein:150,
//   carbohydrates:70,
//   fat:250
// })

// console.log(result,"RESULT4")

app.post('/api/addFood',authenticateJWT, async (req, res) => {
  const { email, password, foodItem } = req.body;

  // Basic Validations
  if (!email || !password || !foodItem) {
    return res.status(400).json({ message: "Email, password, and foodItem fields are required." });
  }

  // Food Item Validations
  if (!foodItem.foodName || typeof foodItem.foodName !== 'string' || foodItem.foodName.length === 0) {
    return res.status(400).json({ message: "Valid foodName is required." });
  }

  if (!foodItem.calories || typeof foodItem.calories !== 'number' ) {
    return res.status(400).json({ message: "Valid calories value is required." });
  }

  if (!foodItem.protein || typeof foodItem.protein !== 'number' || foodItem.protein < 0) {
    return res.status(400).json({ message: "Valid protein value is required." });
  }

  if (!foodItem.carbohydrates || typeof foodItem.carbohydrates !== 'number' || foodItem.carbohydrates < 0) {
    return res.status(400).json({ message: "Valid carbohydrates value is required." });
  }

  if (!foodItem.fat || typeof foodItem.fat !== 'number' || foodItem.fat < 0) {
    return res.status(400).json({ message: "Valid fat value is required." });
  }


  try {
    const result = await addFood(email, password, foodItem);
    res.status(200).json({ message: "FOOD ADDED SUCCESSFULLY", food: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE FOOD

// const result = deleteFood("john.doe@example.com","SecurePassword123","65190ab3ed8a8b50ee20f600")
// console.log("deletd",result)
app.delete('/api/deleteFood',authenticateJWT, async (req, res) => {
  const { email, password, foodId } = req.body;

  // Basic Validations
  if (!email || !password || !foodId) {
    return res.status(400).json({ message: "Email, password, and foodId fields are required." });
  }

  try {
    const result = await deleteFood(email, password, foodId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



//GET GOAL

app.post('/api/goals',authenticateJWT, async (req, res) => {
  const { email, password } = req.body;
  // Basic Validations
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required." });
  }

  try {
    const goal = await getGoal(email, password);
    res.status(200).send(goal);
  } catch (err) {
    if (err.message === "Email not found!" || err.message === "Incorrect Password!") {
      res.status(401).send({ message: err.message });  // Unauthorized
    } else {
      res.status(500).send({ message: err.message });
    }
  }
});




//Add Goal
app.post('/api/addGoal',authenticateJWT, async (req, res) => {
  const { EMAIL, PASSWORD, GoalBody } = req.body;

  // Basic Validations
  if (!EMAIL || !PASSWORD || !GoalBody) {
    return res.status(400).send({ message: "Email, password, and GoalBody are required." });
  }

  // Validating GoalBody based on your goalTrackingSchema
  if (!GoalBody.goalName || !GoalBody.goalDescription || !GoalBody.targetDate || !GoalBody.targetCaloriesValue || !GoalBody.status) {
    return res.status(400).send({ message: "Incomplete GoalBody details." });
  }

  if (!["In Progress", "Achieved", "Abandoned"].includes(GoalBody.status)) {
    return res.status(400).send({ message: "Invalid status in GoalBody." });
  }

  try {
    const addedGoal = await addGoal(EMAIL, PASSWORD, GoalBody);
    res.status(201).send({ success: true, addedGoal });
  } catch (err) {
    if (err.message === "Email Not Found" || err.message === "Incorrect Password!") {
      res.status(401).send({ message: err.message }); // Unauthorized
    } else {
      res.status(500).send({ message: err.message });
    }
  }
});



//DELETE GOAL

app.delete('/api/deleteGoal',authenticateJWT, async (req, res) => {
  const { EMAIL, PASSWORD, Goal_ID } = req.body;

  // Basic Validations
  if (!EMAIL || !PASSWORD || !Goal_ID) {
    return res.status(400).send({ message: "Email, password, and Goal_ID are required." });
  }

  try {
    const deletedGoal = await deleteGoal(EMAIL, PASSWORD, Goal_ID);
    res.status(200).send({ success: true, message: "Goal deleted successfully", deletedGoal });
  } catch (err) {
    if (err.message === "Email Not Found" || err.message === "Incorrect Password!" || err.message === "GOAL not found") {
      res.status(400).send({ message: err.message }); // Bad request
    } else {
      res.status(500).send({ message: "Server error, please try again later." });
    }
  }
});



//PORT LLISTEN
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
