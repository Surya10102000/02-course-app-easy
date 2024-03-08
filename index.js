const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let courseId = 1;

const adminAuthentication = (req, res, next )=>{
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password );
  if(admin){
    next();
  }else {
    res.status(403).json({ msg : " Admin authentication failed"})
  }
};


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => admin.username === a.username); 
  console.log( existingAdmin )
  if(existingAdmin){
    res.status(403).json( {msg : 'Admin already registered'})
  }else {
    ADMINS.push(admin)
    res.json({msg : 'Admin created successfully'})
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ msg : "Logged in successfully"})
  
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  let course = req.body;
  course.Id = courseId++;
  COURSES.push(course)
  res.status(200).json({ msg : "Course created successfully"})
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
