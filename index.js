const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [{
  username : "mukesh",
  password : "pass"
}];
let USERS = [];
let COURSES = [];
let courseId = 1;

//routes to get adminsinfo
app.get("/admins", (req, res) => {
  if(ADMINS.length){
    res.status(200).json({ msg : ADMINS})
  }else
  res.status(404).json({ msg : "There are no admins"})
})
//routes to get usersinfo
app.get("/users", (req, res) => {
  if(USERS.length){
    res.status(200).json({ msg : USERS})
  }else
  res.status(404).json({ msg : "There are no user"})
})
//routes to get adminsinfo
app.get("/courses", (req, res) => {
  if(COURSES.length){
    res.status(200).json({ msg : COURSES})
  }else
  res.status(404).json({ msg : "There are no course"})
})

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    next();
  } else {
    res.status(403).json({ msg: " Admin authentication failed" });
  }
};


// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => admin.username === a.username);
  if (existingAdmin) {
    res.status(403).json({ msg: "Admin already registered" });
  } else {
    ADMINS.push(admin);
    res.json({ msg: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ msg: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  let course = req.body;
  course.Id = courseId++;
  COURSES.push(course);
  res.status(200).json({ msg: "Course created successfully" });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  let Id = parseInt(req.params.courseId);

  let courseIndex = COURSES.findIndex( a => Id === a.Id );

  if (courseIndex === -1) {
    res.status(404).json({ msg: " Course Index not found " });
  }

  let course = req.body
  let keys = Object.keys(course);
  console.log(course, keys)

  keys.forEach((key) => {
    COURSES[courseIndex][key] = course[key];
  });
  res.status(202).json({ msg: " Course Updated successfully" });
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.status(200).json({ course: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
