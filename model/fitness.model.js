const mongoose = require("mongoose");

const caloriesPerMinute = {
  running: 10,
  cycling: 8,
  swimming: 12,  // corrected the typo 'swimmiing'
  walking: 5,  // corrected the typo 'waliking'
  weightlifting: 8,  // changed to lowercase for consistency
  yoga: 3,
  dancing: 7  // changed 'ancing' to 'dancing'
};

const exerciseSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true
  },
  exerciseDuration: {
    type: Number,
    required: true,
    min: 5,
    max: 30,
    default: 5
  },
  caloriesBurned: {
    type: Number,
    required: true,
    default: function() {
      const exerciseType = this.exerciseName.toLowerCase();
      const caloriesPerMinuteForExercise = caloriesPerMinute[exerciseType] || 5;
      return this.exerciseDuration * caloriesPerMinuteForExercise;
    }
  }
}, {
  timestamps: true
});

const foodTrackingSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
  fat: { type: Number, required: true }
});

const goalTrackingSchema = new mongoose.Schema({
  goalName: { type: String, required: true },
  goalDescription: { type: String, required: true },
  targetDate: { type: Date, required: true },
  targetCaloriesValue: { type: Number, required: true },
  status: { type: String, required: true, enum: ["In Progress", "Achieved", "Abandoned"] }
});

const userSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  bio: { type: String, maxlength: 500 },
  otp: { type: String, required: true },

  fitness: {
    exercises: [exerciseSchema],
    foodTracking: [foodTrackingSchema],
    goalTracking: [goalTrackingSchema]
  }
}, {
  timestamps: true
});

// ... rest of your code

const Exercise = mongoose.model('Exercise', exerciseSchema);
const FoodTracking = mongoose.model('FoodTracking', foodTrackingSchema);
const GoalTracking = mongoose.model('GoalTracking', goalTrackingSchema);
const User = mongoose.model('FitnessUsers', userSchema);

module.exports = {

  User
};