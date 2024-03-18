const { json } = require("body-parser");
const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [{
  username : "mukesh",
  password : "pass"
}];
let USERS = [{
  username : "suresh",
  password : "pass",
  purchasedCourses : []
}];
let COURSES = [{ 
  id: 1,
  title: 'course title',
  description: 'course description', 
  price: 100, 
  imageLink: 'https://linktoimage.com', 
  published: true 
}];
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

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (a) => a.username === username && a.password === password
  );
  if (user) {
    next();
  } else {
    res.status(403).json({ msg: " User authentication failed" });
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
  const user = req.body;
  const existingUser = USERS.find( a  => user.username === a.username);
  if (existingUser) {
    res.status(403).json({ msg: "User already registered" });
  } else {
    user.purchasedCourses = [];
    USERS.push(user);
    res.json({ msg: "User created successfully" });
  }
});

app.post("/users/login",userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ msg: "Logged in successfully" });
});

app.get("/users/courses",userAuthentication, (req, res) => {
  // logic to list all courses
  res.status(200).json({ course: COURSES });
});

app.post("/users/courses/:courseId",userAuthentication, (req, res) => {
  // logic to purchase a course
  let username = req.headers.username  
  let courseId = Number(req.params.courseId)
  let course = COURSES.find(a => a.id === courseId && a.published)
  if(course){
    let userIndex = USERS.findIndex( a => a.username === username)
    USERS[userIndex].purchasedCourses.push(course);
    res.status(200).json({ msg : "Course purchased successfully"})
  }else{
    res.status(404).json({ msg : "Course not found"  })
  }
});

app.get("/users/purchasedCourses",userAuthentication, (req, res) => {
  // logic to view purchased courses
  let username = req.headers.username  
  let userIndex = USERS.findIndex( a => a.username === username)
  if( USERS[userIndex].purchasedCourses.length !== 0 ){
    res.status(200).json({ purchasedCourses : USERS[userIndex].purchasedCourses})
  }else{
    res.status(404).json({ msg : " No book found "})
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
