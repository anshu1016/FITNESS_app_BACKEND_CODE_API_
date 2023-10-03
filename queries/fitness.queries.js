const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const fs = require('fs');

const jsonData = fs.readFileSync('./Data.json', 'utf8');

const { User } = require("../model/fitness.model.js")

const UserData = JSON.parse(jsonData);

const JWT_SECRET = "Gangadhar Hi Shaktiman Hai";

async function seedDataBase() {
  try {
    console.log("Seeding Database Started");

    const userDataArray = Array.isArray(UserData) ? UserData : [UserData];

    for (const userData of userDataArray) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = new User({
        emailAddress: userData.emailAddress,
        password: hashedPassword,
        profilePic: userData.profilePic,
        bio: userData.bio,
        otp: userData.otp,
        fitness: {
          exercises: userData.fitness.exercises.map(exercise => ({
            exerciseName: exercise.exerciseName,
            exerciseDuration: exercise.exerciseDuration
          })),
          foodTracking: userData.fitness.foodTracking,
          goalTracking: userData.fitness.goalTracking
        }
      });

      await newUser.save();
      console.log(`User "${newUser.emailAddress}" seeded.`);
    }

    console.log('Database seeding complete.');
  } catch (error) {
    console.error("Error in Seeding Database", error);
  } finally {
    mongoose.disconnect();
  }
}

async function getExercises(email, password) {
  try {
    console.log("FUNCTION CALLED")
    const checkUserExists = await User.findOne({ emailAddress: email });
    if (!checkUserExists) {
      throw new Error("Email not found!");
    }
    const isMatch = await bcrypt.compare(password, checkUserExists.password)
    if (isMatch) {
      //generate JWT
      const token = jwt.sign({ id: checkUserExists._id }, JWT_SECRET, {
        expiresIn: "18h"
      })
      console.log(token, checkUserExists.fitness.exercises, "EXERCISES")
      return ({
        token: token,
        exercises: checkUserExists.fitness.exercises
      })
    }
  } catch (error) {
    console.log("error in getting Exercise", error);
    throw new Error("Incorrect Password!");
  }
}

// ADD EXERCISE
async function addExercise(EMAIL, PASSWORD, ExerciseBody) {
  try {
    const checkUserExists = await User.findOne({ emailAddress: EMAIL });

    if (!checkUserExists) {
      console.log("User Doesn't Exist. Please sign in first.");
      throw new Error("Email Not Found");
    }

    const isMatch = await bcrypt.compare(PASSWORD, checkUserExists.password);

    if (!isMatch) {
      throw new Error("Incorrect Password!");
    }

    const addedExercise = checkUserExists.fitness.exercises.push(ExerciseBody);

    await checkUserExists.save();

    console.log("Exercise added successfully.");
    console.log(addedExercise);
    return ExerciseBody;
  } catch (err) {
    console.log("Error in adding Exercise", err);
    throw err;
  }
}


//DELETE EXERCISE
async function deleteExercise(EMAIL, PASSWORD, EXERCISE_ID) {
  try {
    const checkUserExists = await User.findOne({ emailAddress: EMAIL });

    if (!checkUserExists) {
      console.log("User Doesn't Exist. Please sign in first.");
      throw new Error("Email Not Found");
    }

    const isMatch = await bcrypt.compare(PASSWORD, checkUserExists.password);

    if (!isMatch) {
      throw new Error("Incorrect Password!");
    }

    const deletedExercise = checkUserExists.fitness.exercises.find(exercise => exercise._id.toString() === EXERCISE_ID);

    if (!deletedExercise) {
      console.log("Exercise with given ID not found.");
      throw new Error("Exercise not found");
    }

    checkUserExists.fitness.exercises = checkUserExists.fitness.exercises.filter(exercise => exercise._id.toString() !== EXERCISE_ID);
    console.log(checkUserExists.fitness.exercises)
    await checkUserExists.save();

    console.log("Exercise Deleted");
    return deletedExercise;  // or return a success message or the filtered list, based on your requirements

  } catch (err) {
    console.log("Error in deleting Exercise", err);
    throw err;
  }
}


//GET ALL FOOD
async function getAllFood(EMAIL, PASSWORD) {
  try {
    const checkUserExists = await User.findOne({ emailAddress: EMAIL });

    if (!checkUserExists) {
      console.log("User Doesn't Exist. Please sign in first.");
      throw new Error("Email Not Found");
    }

    const isMatch = await bcrypt.compare(PASSWORD, checkUserExists.password);

    if (!isMatch) {
      throw new Error("Incorrect Password!");
    }

    const token = jwt.sign({ id: checkUserExists._id }, JWT_SECRET, {
      expiresIn: "4h"
    });

    console.log(checkUserExists.fitness.foodTracking, "FOODS");
    return ({
      success: true,
      foods: checkUserExists.fitness.foodTracking
    });

  } catch (err) {
    console.log("Error in getting Foods", err);
    throw err;
  }
}



//ADD FOOD

async function addFood(EMAIL, PASSWORD, FoodBody) {
  try {
    const checkUserExists = await User.findOne({ emailAddress: EMAIL });

    if (!checkUserExists) {
      console.log("User Doesn't Exist. Please sign in first.");
      throw new Error("Email Not Found");
    }

    const isMatch = await bcrypt.compare(PASSWORD, checkUserExists.password);

    if (!isMatch) {
      throw new Error("Incorrect Password!");
    }

    const addedFood = checkUserExists.fitness.foodTracking.push(FoodBody);

    await checkUserExists.save();

    console.log("Food added successfully.");
    console.log(addedFood);
    return checkUserExists.fitness.foodTracking;
  } catch (err) {
    console.log("Error in adding Food", err);
    throw err;
  }
}

//DELETE FFOD

async function deleteFood(EMAIL, PASSWORD, FOOD_ID) {
  try {
    const checkUserExists = await User.findOne({ emailAddress: EMAIL });

    if (!checkUserExists) {
      console.log("User Doesn't Exist. Please sign in first.");
      throw new Error("Email Not Found");
    }

    const isMatch = await bcrypt.compare(PASSWORD, checkUserExists.password);

    if (!isMatch) {
      throw new Error("Incorrect Password!");
    }

    const deleteFood = checkUserExists.fitness.foodTracking.find(food => food._id.toString() === FOOD_ID);

    if (!deleteFood) {
      console.log("Food with given ID not found.");
      throw new Error("Food not found");
    }

    checkUserExists.fitness.foodTracking = checkUserExists.fitness.foodTracking.filter(food => food._id.toString() !== FOOD_ID);
    console.log(checkUserExists.fitness.foodTracking)
    await checkUserExists.save();

    console.log("Food Deleted");
    return deleteFood;  // or return a success message or the filtered list, based on your requirements

  } catch (err) {
    console.log("Error in deleting food", err);
    throw err;
  }
}



async function getGoal(email, password) {
  try {
    console.log("FUNCTION CALLED")
    const checkUserExists = await User.findOne({ emailAddress: email });
    if (!checkUserExists) {
      throw new Error("Email not found!");
    }
    const isMatch = await bcrypt.compare(password, checkUserExists.password)
    if (isMatch) {
      //generate JWT
      const token = jwt.sign({ id: checkUserExists._id }, JWT_SECRET, {
        expiresIn: "4h"
      })
      console.log(token, checkUserExists.fitness.goalTracking, "EXERCISES")
      return ({

        goal: checkUserExists.fitness.goalTracking
      })
    }
  } catch (error) {
    console.log("error in getting Goal", error);
    throw new Error("Incorrect Password!");
  }
}









// ADD GOAL
async function addGoal(EMAIL, PASSWORD, GoalBody) {
  try {
    const checkUserExists = await User.findOne({ emailAddress: EMAIL });

    if (!checkUserExists) {
      console.log("User Doesn't Exist. Please sign in first.");
      throw new Error("Email Not Found");
    }

    const isMatch = await bcrypt.compare(PASSWORD, checkUserExists.password);

    if (!isMatch) {
      throw new Error("Incorrect Password!");
    }

    const addGoal = checkUserExists.fitness.goalTracking.push(GoalBody);

    await checkUserExists.save();

    console.log("Goal added successfully.");
    console.log(addGoal);
    return addGoal;
  } catch (err) {
    console.log("Error in adding Goal", err);
    throw err;
  }
}














//DELETE Goal
async function deleteGoal(EMAIL, PASSWORD, GOAL_ID) {
  try {
    const checkUserExists = await User.findOne({ emailAddress: EMAIL });

    if (!checkUserExists) {
      console.log("User Doesn't Exist. Please sign in first.");
      throw new Error("Email Not Found");
    }

    const isMatch = await bcrypt.compare(PASSWORD, checkUserExists.password);

    if (!isMatch) {
      throw new Error("Incorrect Password!");
    }

    const deletedGoal = checkUserExists.fitness.goalTracking.find(goal => goal._id.toString() === GOAL_ID);

    if (!deletedGoal) {
      console.log("GOAL with given ID not found.");
      throw new Error("GOAL not found");
    }

    checkUserExists.fitness.goalTracking = checkUserExists.fitness.goalTracking.filter(goal => goal._id.toString() !== GOAL_ID);
    console.log(checkUserExists.fitness.goalTracking)
    await checkUserExists.save();

    console.log("GOal Deleted");
    return deletedGoal;  // or return a success message or the filtered list, based on your requirements

  } catch (err) {
    console.log("Error in deleting Goal", err);
    throw err;
  }
}


















module.exports = { seedDataBase, getExercises, addExercise, deleteExercise, getAllFood, addFood, deleteFood, getGoal, deleteGoal, addGoal };
